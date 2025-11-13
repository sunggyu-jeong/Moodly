import type { EmotionDistribution } from '@/entities/ai-report/model/ui';

export type AIReportDomain = {
  date: string;
  title: string;
  summary: string;
  emotion_distribution: EmotionDistribution;
  weekly_keywords: string[];
  core_inner_keywords: string[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};
