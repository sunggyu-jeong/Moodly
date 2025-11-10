export interface WeeklyProgress {
  doneDays: number;
  totalDays: number;
  isFirst: boolean;
}

export type WeeklySummaryResult = {
  summary: string;
  emotion_distribution: {
    joy: number;
    sadness: number;
    depression: number;
    anxiety: number;
    anger: number;
  };
  weekly_keywords: string[];
  core_inner_keywords: string[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};

export type WeeklySummaryPayload = {
  model: 'gemini-2.5-flash';
  temperature: number;
  max_tokens: number;
  response_mime_type: 'application/json';
  response_schema: unknown;
  safety_settings: unknown[];
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
};

export type EmotionDistribution = {
  joy: number;
  sadness: number;
  depression: number;
  anxiety: number;
  anger: number;
};

export type AIReport = {
  date: string;
  title: string;
  summary: string;
  emotion_distribution: EmotionDistribution;
  weekly_keywords: string[];
  core_inner_keywords: string[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};
