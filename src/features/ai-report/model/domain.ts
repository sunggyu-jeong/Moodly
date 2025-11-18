import type { EmotionDistribution } from '@/entities/ai-report/model/ui';

type CoreInnerKeywordsType = {
  title: string;
  message: string;
};
export type AIReportDomain = {
  date: string;
  title: string;
  summary: string;
  emotion_distribution: EmotionDistribution;
  weekly_keywords: string[];
  core_inner_keywords: CoreInnerKeywordsType[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};
