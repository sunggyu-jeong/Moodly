import type { EmotionDistribution, EmotionStat, UIEmotionKey } from '@/entities/ai-report/model/ui';
import type { AIReportDomain } from '@/features/ai-report/model/domain';
import type { WeeklySummaryResultDTO } from '@/features/ai-report/model/dto';

export function dtoToDomain(
  dto: WeeklySummaryResultDTO,
  meta: { date: string; title: string },
): AIReportDomain {
  const dist: EmotionDistribution = {
    joy: dto.emotion_distribution.joy ?? 0,
    sad: dto.emotion_distribution.sad ?? 0,
    calm: dto.emotion_distribution.calm ?? 0,
    anxiety: dto.emotion_distribution.anxiety ?? 0,
    angry: dto.emotion_distribution.angry ?? 0,
  };
  return {
    date: meta.date,
    title: meta.title,
    summary: dto.summary,
    emotion_distribution: dist,
    weekly_keywords: dto.weekly_keywords,
    core_inner_keywords: dto.core_inner_keywords,
    self_reflection_questions: dto.self_reflection_questions,
    message_from_moodly: dto.message_from_moodly,
  };
}

const DOMAIN_TO_UI: Record<UIEmotionKey, UIEmotionKey> = {
  joy: 'joy',
  sad: 'sad',
  calm: 'calm',
  anxiety: 'anxiety',
  angry: 'angry',
};

export function domainToUIStats(
  domain: EmotionDistribution,
  iconMap: Record<UIEmotionKey, any>,
): EmotionStat[] {
  const acc: Record<UIEmotionKey, number> = { joy: 0, sad: 0, anxiety: 0, angry: 0, calm: 0 };
  (Object.keys(domain) as UIEmotionKey[]).forEach(k => {
    const uiKey = DOMAIN_TO_UI[k];
    acc[uiKey] += domain[k] || 0;
  });
  return (Object.keys(acc) as UIEmotionKey[]).map(k => ({
    key: k,
    percent: acc[k],
    icon: iconMap[k],
  }));
}
