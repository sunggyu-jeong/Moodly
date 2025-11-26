import { createClient } from "@supabase/supabase-js";
import { task } from "@trigger.dev/sdk/v3";
import { encryptData } from "../util/crypto";
import { ENV } from "./env";

function safeTrunc(s: any, n = 400) {
  let str = "";
  if (typeof s === "string") str = s;
  else {
    try { str = JSON.stringify(s); } catch { str = String(s); }
  }
  return str.length <= n ? str : str.slice(0, n) + "…";
}

function splitMessagesForGemini(messages: any[]) {
  const systemTexts = [];
  const contents = [];
  for (const m of messages ?? []) {
    if (!m || typeof m.content !== "string") continue;
    if (m.role === "system") {
      systemTexts.push(m.content);
      continue;
    }
    const role = m.role === "assistant" ? "model" : "user";
    contents.push({ role, parts: [{ text: m.content }] });
  }
  return { systemInstruction: systemTexts.join("\n\n").trim(), contents };
}

function extractGeminiText(data: any) {
  const cand = data?.candidates?.[0];
  if (!cand) return "";
  const parts = Array.isArray(cand?.content?.parts) ? cand.content.parts : [];
  const texts = parts.map((p: any) => (typeof p?.text === "string" ? p.text : "")).filter(Boolean);
  if (texts.length === 0 && typeof cand?.content?.text === "string") return cand.content.text;
  return texts.join("");
}

function getFinishReason(data: any) {
  return data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || null;
}

function parseWeeklyJSON(str: string) {
  try {
    const obj = JSON.parse(str);
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      return { ok: false, reason: "NOT_OBJECT" };
    }
    return { ok: true, data: obj };
  } catch {
    return { ok: false, reason: "INVALID_JSON" };
  }
}

function lightValidateWeeklyObj(o: any) {
  try {
    const qs = o?.self_reflection_questions;
    if (!Array.isArray(qs) || qs.length !== 3) return { ok: false, reason: "SRQ_LENGTH" };
    if (qs.some((q: any) => typeof q !== "string" || q.length < 20 || !q.includes("?"))) return { ok: false, reason: "SRQ_QUALITY" };
    const emo = o?.emotion_distribution || {};
    const sum = ["joy", "sad", "calm", "anxiety", "angry"].reduce((a: any, k: any) => a + Number(emo[k] ?? 0), 0);
    if (Math.abs(sum - 100) > 0.1) return { ok: false, reason: "EMO_SUM_NOT_100" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "INVALID_OBJECT" };
  }
}

async function callGemini(model: string, payload: any, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
  
  console.log(`Requesting Gemini Model: ${model}`);

  const resp = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errorBody = await resp.text();
    console.error(`Gemini API Error (${resp.status}):`, errorBody);
    throw new Error(`Gemini API Error: ${resp.status} - ${errorBody}`);
  }

  const data = await resp.json();
  return { resp, data };
}

export const processGeminiJob = task({
  id: "process-gemini-job",
  machine: { preset: "micro" },
  retry: { maxAttempts: 3, minTimeoutInMs: 1000, maxTimeoutInMs: 10000 },
  
  run: async (payload: { jobId: string }) => {
    const { GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = ENV;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const { jobId } = payload;
    const startedAt = new Date();

    const { data: jobData, error } = await supabase
      .from("tb_ai_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !jobData) throw new Error(`Job not found: ${jobId}`);
    if (jobData.status === 'completed') return { message: "Already completed" };

    await supabase.from("tb_ai_jobs").update({ status: 'processing', started_at: startedAt.toISOString() }).eq("id", jobId);

    try {
      const factInput = jobData.input_payload.factInput;
      if (!factInput) throw new Error("Missing factInput");

      const systemPrompt = `
      당신은 대한민국의 전문 심리상담사입니다. 다음 절대 규칙을 준수하세요.
      1) 출력은 오직 하나의 JSON 객체, 코드블록/마크다운/텍스트 금지.
      2) 제공된 JSON 스키마의 모든 필드 필수.
      3) 진단·치료·약물 언급 금지.
      4) 질문형 문장은 self_reflection_questions에서만 허용.
      5) emotion_distribution 합계=100.
      6) 총 분량은 최소 500자.
      7) 일별/요일별 기술 금지, 오직 ‘한 주간 통합’ 결과만 서술.
      8) weekly_keywords는 한 주의 핵심 키워드 5개를 중요도에 따라 1~5 사이의 weight로 함께 제공하세요.
      `;

      const body = {
        model: "gemini-2.5-flash",
        temperature: 0.3,
        max_tokens: 2500,
        response_mime_type: "application/json",
        response_schema: {
          type: "OBJECT",
          required: [
            "title",
            "summary",
            "emotion_distribution",
            "weekly_keywords",
            "core_inner_keywords",
            "self_reflection_questions",
            "message_from_moodly"
          ],
          properties: {
            title: { type: "STRING", minLength: 5, maxLength: 15 },
            emotion_distribution: {
              type: "OBJECT",
              required: ["joy", "sad", "calm", "anxiety", "angry"],
              properties: {
                joy: { type: "NUMBER", minimum: 0, maximum: 100 },
                sad: { type: "NUMBER", minimum: 0, maximum: 100 },
                calm: { type: "NUMBER", minimum: 0, maximum: 100 },
                anxiety: { type: "NUMBER", minimum: 0, maximum: 100 },
                angry: { type: "NUMBER", minimum: 0, maximum: 100 }
              }
            },
            weekly_keywords: {
              type: "ARRAY", minItems: 5, maxItems: 5,
              items: {
                type: "OBJECT", required: ["label", "weight"],
                properties: {
                  label: { type: "STRING", minLength: 1, maxLength: 10 },
                  weight: { type: "NUMBER", minimum: 0, maximum: 1 }
                }
              }
            },
            core_inner_keywords: {
              type: "ARRAY", minItems: 3, maxItems: 3,
              items: {
                type: "OBJECT", required: ["title", "message"],
                properties: {
                  title: { type: "STRING", minLength: 5, maxLength: 40 },
                  message: { type: "STRING", minLength: 20, maxLength: 120 }
                }
              }
            },
            self_reflection_questions: {
              type: "ARRAY", minItems: 3, maxItems: 3,
              items: { type: "STRING", minLength: 20 }
            },
            message_from_moodly: { type: "STRING", minLength: 100 }
          }
        },
        safety_settings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" }
        ],
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `[FACT INPUT] ${factInput}` }
        ]
      };

      const { systemInstruction, contents } = splitMessagesForGemini(body.messages);
      
      const generationConfig = {
        maxOutputTokens: body.max_tokens ?? 1024,
        temperature: body.temperature ?? 0.2,
        responseMimeType: body.response_mime_type,
        responseSchema: body.response_schema,
      };

      const geminiPayload = {
        contents,
        generationConfig,
        system_instruction: { parts: [{ text: systemInstruction }] },
      };

      let { data: data1 } = await callGemini(body.model, geminiPayload, GEMINI_API_KEY);
      
      const finish1 = getFinishReason(data1);
      let text = extractGeminiText(data1);
      let parsed = parseWeeklyJSON(text);
      let light = parsed.ok ? lightValidateWeeklyObj(parsed.data) : { ok: false, reason: "INVALID_JSON" };
      console.log(">>>>", finish1, text, parsed, light)

      if (!parsed.ok || !light.ok || finish1 === "MAX_TOKENS") {
        const retryPayload = {
            ...geminiPayload,
            generationConfig: { ...generationConfig, maxOutputTokens: 2200 },
            system_instruction: {
                parts: [{ text: systemInstruction + "\n\n이전 응답이 불완전했습니다. 완전한 JSON을 출력하세요." }]
            }
        };
        const { data: data2 } = await callGemini(body.model, retryPayload, GEMINI_API_KEY);
        const text2 = extractGeminiText(data2);
        const parsed2 = parseWeeklyJSON(text2);
        
        if (parsed2.ok) {
            text = text2;
            parsed = parsed2;
            light = lightValidateWeeklyObj(parsed2.data);
        }
      }

      if (!parsed.ok) throw new Error(`Invalid JSON Output: ${safeTrunc(text, 100)}`);
      if (!light.ok) throw new Error(`Schema Validation Failed: ${light.reason}`);

      const usage = data1?.usageMetadata ? {
        input: Number(data1.usageMetadata.promptTokenCount ?? 0),
        output: Number(data1.usageMetadata.candidatesTokenCount ?? 0),
        total: Number(data1.usageMetadata.totalTokenCount ?? 0)
      } : { input: 0, output: 0, total: 0 };

      const meta = jobData.input_payload.meta || {};
      
      if (meta.start_date && meta.end_date && jobData.user_id) {
        await supabase.from("user_weekly_reports").insert({
          user_id: jobData.user_id,
          start_date: meta.start_date,
          end_date: meta.end_date,
          report_data: parsed.data 
        });
      }

      const completedAt = new Date();
      await supabase.from("tb_ai_jobs").update({
        status: 'completed',
        result_data: encryptData(parsed.data), 
        usage_info: usage,
        completed_at: completedAt.toISOString(),
        execution_time_ms: completedAt.getTime() - startedAt.getTime()
      }).eq("id", jobId);

      return { status: "success", result: parsed.data };

    } catch (error: any) {
      const completedAt = new Date();
      await supabase.from("tb_ai_jobs").update({
        status: 'failed',
        error_message: error.message || String(error),
        completed_at: completedAt.toISOString(),
        execution_time_ms: completedAt.getTime() - startedAt.getTime()
      }).eq("id", jobId);

      throw error;
    }
  },
});