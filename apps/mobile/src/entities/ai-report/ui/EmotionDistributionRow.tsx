import { Image, StyleSheet, View } from 'react-native';

import { EMOTION_ICON_MAP } from '@/entities/ai-report/model/constants';
import type { EmotionDistribution } from '@/entities/ai-report/model/ui';
import { gray } from '@/shared/styles/colors';
import { Caption } from '@/shared/ui/typography/Caption';

type Props = { data: EmotionDistribution };

export default function EmotionDistributionRow({ data }: Props) {
  const entries = Object.entries(data) as [keyof EmotionDistribution, number][];
  return (
    <View style={styles.row}>
      {entries.map(([k, v]) => (
        <View
          key={k}
          style={styles.col}
        >
          <Image
            style={styles.icon}
            source={EMOTION_ICON_MAP[k]}
          />
          <View style={styles.badge}>
            <Caption
              weight="semibold"
              style={styles.percent}
            >
              {v}%
            </Caption>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  col: { flex: 1, alignItems: 'center', gap: 8 },
  icon: { width: 38, height: 38 },
  badge: { backgroundColor: gray[200], borderRadius: 6 },
  percent: { margin: 4, color: gray[400], textAlign: 'center' },
});
