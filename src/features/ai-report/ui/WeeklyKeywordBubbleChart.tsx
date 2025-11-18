// src/features/ai-report/ui/WeeklyKeywordBubbleChart.tsx
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Body2 } from '@/shared/ui/typography/Body2';

// src/features/ai-report/lib/mapKeywordScoreToRadius.ts
export const mapKeywordScoreToRadius = (score: number) => {
  const MIN_RADIUS = 26; // 너무 작지 않게
  const MAX_RADIUS = 64; // 가장 큰 원

  const s = Math.min(1, Math.max(0, score)); // 0~1 클램프
  return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * s;
};
export const mapKeywordScoreToColor = (score: number) => {
  const s = Math.min(1, Math.max(0, score));
  // 기본 파랑에 알파만 조절
  const alpha = 0.4 + 0.4 * s; // 0.4 ~ 0.8
  return `rgba(120, 141, 255, ${alpha})`;
};

type KeywordBubble = {
  label: string;
  weight: number; // 0 ~ 1
};

type WeeklyKeywordBubbleChartProps = {
  items: KeywordBubble[];
  size?: number;
};

const RELATIVE_POSITIONS = [
  { x: 0.3, y: 0.3 },
  { x: 0.78, y: 0.3 },
  { x: 0.25, y: 0.78 },
  { x: 0.78, y: 0.8 },
  { x: 0.55, y: 0.55 },
];

export const WeeklyKeywordBubbleChart: React.FC<WeeklyKeywordBubbleChartProps> = ({
  items,
  size = 220,
}) => {
  const sorted = useMemo(
    () => [...items].sort((a, b) => b.weight - a.weight).slice(0, RELATIVE_POSITIONS.length),
    [items],
  );

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {sorted.map((item, idx) => {
        const pos = RELATIVE_POSITIONS[idx];
        const radius = mapKeywordScoreToRadius(item.weight);
        const diameter = radius * 2;

        const left = pos.x * size - radius;
        const top = pos.y * size - radius;

        return (
          <View
            key={item.label}
            style={[
              styles.bubble,
              {
                width: diameter,
                height: diameter,
                borderRadius: radius,
                left,
                top,
                backgroundColor: mapKeywordScoreToColor(item.weight),
              },
            ]}
          >
            <Body2
              weight="semibold"
              style={styles.bubbleText}
            >
              {item.label}
            </Body2>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#F5F7FB',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    color: 'white',
  },
});
