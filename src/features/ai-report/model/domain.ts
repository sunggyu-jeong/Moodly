export const DOMAIN_EMOTIONS = ['joy', 'sadness', 'depression', 'anxiety', 'anger'] as const;
export type DomainEmotionKey = (typeof DOMAIN_EMOTIONS)[number];

export type EmotionDistribution = Readonly<Record<DomainEmotionKey, number>>;

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
