import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk/v3";
import { decryptData } from "../util/crypto";
import { processGeminiJob } from "./process-gemini";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const weeklyDiaryAggregator = schedules.task({
  id: "weekly-diary-aggregator",
  cron: "0 15 * * 6",

  run: async (payload) => {
    console.log("[Weekly Aggregator] 주간 일기 집계 프로세스 시작...");

    const now = new Date(payload.timestamp);
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);

    const fmtStart = startDate.toISOString().split('T')[0];
    const fmtEnd = endDate.toISOString().split('T')[0];

    console.log(`집계 기간: ${fmtStart} ~ ${fmtEnd}`);

    const { data: diaries, error } = await supabase
      .from("moodly_diary")
      .select("user_id, description, record_date, created_at, icon_id")
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .not("description", "is", null);

    if (error) {
      console.error("일기 데이터 조회 중 에러 발생:", error);
      throw error;
    }

    if (!diaries || diaries.length === 0) {
      console.log("ℹ집계할 일기 데이터가 없습니다. 작업을 종료합니다.");
      return { message: "NO_DATA", range: `${fmtStart}~${fmtEnd}` };
    }

    console.log(`📦 조회된 원본 일기 개수: ${diaries.length}건`);

    const userMap = new Map<string, any[]>();

    for (const diary of diaries) {
      const recordDate = diary.record_date;
      const createDate = diary.created_at.split('T')[0];

      if (recordDate !== createDate) {
        continue;
      }

      let plainDescription = "";
      try {
        const decrypted = decryptData(diary.description);
        plainDescription = typeof decrypted === 'string' ? decrypted : JSON.stringify(decrypted);
      } catch (e) {
        console.warn(`복호화 실패 (User: ${diary.user_id}, Date: ${recordDate}) - 건너뜀`);
        continue;
      }

      if (!plainDescription) continue;

      if (!userMap.has(diary.user_id)) {
        userMap.set(diary.user_id, []);
      }
      
      userMap.get(diary.user_id)?.push({
        date: recordDate,
        content: plainDescription,
        mood: diary.icon_id
      });
    }

    const jobsToInsert = [];

    for (const [userId, diaryEntries] of userMap) {
      if (diaryEntries.length < 0) continue;

      const combinedDiaries = diaryEntries
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(d => `[${d.date}] (감정아이콘:${d.mood}) ${d.content}`)
        .join("\n\n");

      jobsToInsert.push({
        user_id: userId,
        status: 'pending',
        input_payload: {
          factInput: `다음은 사용자의 지난 일주일간 일기입니다. 이를 분석하여 심리 리포트를 작성해주세요:\n\n${combinedDiaries}`,
          meta: {
            start_date: fmtStart,
            end_date: fmtEnd
          }
        }
      });
    }

    if (jobsToInsert.length === 0) {
      console.log("조건을 만족하는(유효한) 일기가 없어 작업을 생성하지 않습니다.");
      return { message: "NO_VALID_DIARIES", count: 0 };
    }

    console.log(`생성할 리포트 작업 수: ${jobsToInsert.length}건`);

    const { data: insertedJobs, error: insertError } = await supabase
      .from("tb_ai_jos")
      .insert(jobsToInsert)
      .select("id");

    if (insertError) {
      console.error("tb_ai_jos 테이블 INSERT 실패:", insertError);
      throw new Error(`Queue Insert Failed: ${insertError.message}`);
    }

    console.log(`tb_ai_jos 테이블에 ${insertedJobs.length}건 저장 완료.`);

    const batchPayloads = insertedJobs.map((job) => ({
      payload: { jobId: job.id },
    }));

    const batchResult = await processGeminiJob.batchTrigger(batchPayloads);

    console.log(`배치 트리거 완료 (Batch ID: ${batchResult.batchId})`);

    return {
      message: "SUCCESS",
      inserted_count: insertedJobs.length,
      batch_id: batchResult.batchId,
      period: `${fmtStart} ~ ${fmtEnd}`
    };
  },
});