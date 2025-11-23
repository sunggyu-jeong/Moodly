import { useMemo } from 'react';

import { calculateBubbleLayout } from '@/features/ai-report/lib/bubble-layout.util';
import type { KeywordBubble } from '@/features/ai-report/model/domain';

export const useBubbleChart = (items: KeywordBubble[], size: number) => {
  return useMemo(() => calculateBubbleLayout(items, size), [items, size]);
};
