import type { EmotionDistribution } from '@/entities/ai-report/model/ui';

export type CoreInnerKeywordsType = {
  title: string;
  message: string;
};
export type AIReportDomain = {
  date: string;
  title: string;
  summary: string;
  emotion_distribution: EmotionDistribution;
  weekly_keywords: KeywordBubble[];
  core_inner_keywords: CoreInnerKeywordsType[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};

export type KeywordBubble = {
  label: string;
  weight: number;
};
