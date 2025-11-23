import type { KeywordBubble } from '@/features/ai-report/model/domain';

const RELATIVE_POSITIONS = [
  { x: 0.25, y: 0.28 },
  { x: 0.75, y: 0.28 },
  { x: 0.75, y: 0.72 },
  { x: 0.25, y: 0.72 },
  { x: 0.5, y: 0.5 },
];

const BUBBLE_PALETTE = ['#8EA4F7', '#BCC0D1', '#9DA8CE', '#D4DCFA', '#E0E3EB'];

export type ProcessedBubble = KeywordBubble & {
  radius: number;
  diameter: number;
  top: number;
  left: number;
  color: string;
  zIndex: number;
};

export const calculateBubbleLayout = (
  items: KeywordBubble[],
  containerSize: number,
): { bubbles: ProcessedBubble[] } => {
  const sortedItems = [...items].sort((a, b) => b.weight - a.weight).slice(0, 5);

  if (sortedItems.length === 0) return { bubbles: [] };

  const maxWeight = sortedItems[0].weight || 1;
  const minWeight = sortedItems[sortedItems.length - 1].weight || 0;
  const weightRange = maxWeight - minWeight;

  const bubbles = sortedItems.map((item, idx) => {
    const relativeScore = weightRange === 0 ? 0.5 : (item.weight - minWeight) / weightRange;
    const MIN_RADIUS = 48;
    const MAX_RADIUS = 72;

    const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * relativeScore;
    const diameter = radius * 2;
    const pos = RELATIVE_POSITIONS[idx % RELATIVE_POSITIONS.length];

    return {
      ...item,
      radius,
      diameter,
      left: pos.x * containerSize - radius,
      top: pos.y * containerSize - radius,
      color: BUBBLE_PALETTE[idx % BUBBLE_PALETTE.length],
      zIndex: 5 - idx,
    };
  });

  return { bubbles };
};
