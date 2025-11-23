import { calculateBubbleLayout } from '@/features/ai-report/lib/bubble-layout.util';
import type { KeywordBubble } from '@/features/ai-report/model/domain';

const MOCK_ITEMS: KeywordBubble[] = [
  { label: '1등', weight: 100 },
  { label: '2등', weight: 80 },
  { label: '3등', weight: 60 },
  { label: '4등', weight: 40 },
  { label: '5등', weight: 20 },
  { label: '탈락', weight: 10 },
  { label: '탈락', weight: 5 },
];

describe('WeeklyKeywordChart - Layout Logic', () => {
  it('가중치 순으로 상위 5개 아이템만 반환해야 한다', () => {
    const containerSize = 320;
    const { bubbles } = calculateBubbleLayout(MOCK_ITEMS, containerSize);

    expect(bubbles).toHaveLength(5);
    expect(bubbles[0].label).toBe('1등');
    expect(bubbles[4].label).toBe('5등');
  });

  it('가장 높은 가중치는 최대 반지름을, 가장 낮은 가중치는 최소 반지름을 가져야 한다', () => {
    const { bubbles } = calculateBubbleLayout(MOCK_ITEMS, 320);

    expect(bubbles[0].radius).toBeGreaterThan(bubbles[4].radius);
  });

  it('모든 버블은 렌더링 가능한 좌표(top, left)를 가져야 한다', () => {
    const { bubbles } = calculateBubbleLayout(MOCK_ITEMS, 320);

    bubbles.forEach(bubble => {
      expect(bubble.top).not.toBeNaN();
      expect(bubble.left).not.toBeNaN();
      expect(typeof bubble.color).toBe('string');
    });
  });

  it('데이터가 비어있을 경우 빈 배열을 반환해야 한다', () => {
    const { bubbles } = calculateBubbleLayout([], 320);
    expect(bubbles).toEqual([]);
  });
});
