export type WeeklySummaryResultDTO = {
  summary: string;
  emotion_distribution: {
    joy: number;
    sad: number;
    calm: number;
    anxiety: number;
    angry: number;
  };
  weekly_keywords: string[];
  core_inner_keywords: string[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};

export type WeeklySummaryPayloadDTO = {
  model: 'gemini-2.5-flash';
  temperature: number;
  max_tokens: number;
  response_mime_type: 'application/json';
  response_schema: unknown;
  safety_settings: unknown[];
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
};
