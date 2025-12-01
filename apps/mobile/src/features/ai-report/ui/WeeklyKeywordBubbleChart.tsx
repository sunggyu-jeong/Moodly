import { StyleSheet, View } from 'react-native';

import { useBubbleChart } from '@/features/ai-report/hooks/useBubbleChart';
import type { KeywordBubble } from '@/features/ai-report/model/domain';
import { Body2 } from '@/shared/ui/typography/Body2';

type WeeklyKeywordBubbleChartProps = {
  items: KeywordBubble[];
  size?: number;
};

export const WeeklyKeywordBubbleChart = ({ items, size = 320 }: WeeklyKeywordBubbleChartProps) => {
  const { bubbles } = useBubbleChart(items, size);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {bubbles.map((bubble, idx) => (
        <View
          key={`${bubble.label}-${idx}`}
          style={[
            styles.bubble,
            {
              width: bubble.diameter,
              height: bubble.diameter,
              borderRadius: bubble.radius,
              left: bubble.left,
              top: bubble.top,
              backgroundColor: bubble.color,
              zIndex: bubble.zIndex,
            },
          ]}
        >
          <Body2
            weight="semibold"
            style={styles.bubbleText}
          >
            {bubble.label}
          </Body2>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // ... shadow styles
  },
  bubbleText: {
    color: 'white',
    textAlign: 'center',
  },
});
