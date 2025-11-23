import type { ImageSourcePropType } from 'react-native';
import { Image, View } from 'react-native';

import { gray } from '@/shared/styles/colors';
import { Caption } from '@/shared/ui/typography/Caption';

type EmotionStatItem = {
  key: string;
  icon: ImageSourcePropType;
  percent: number;
};

type EmotionStatItemProps = {
  stats: EmotionStatItem[];
};

export const EmotionDistribution = ({ stats }: EmotionStatItemProps) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {stats.map(stat => (
        <View
          key={stat.key}
          style={{
            flex: 1,
            flexDirection: 'column',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Image
            style={{ width: 38, height: 38 }}
            source={stat.icon}
          />
          <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
            <Caption
              weight="semibold"
              style={{ padding: 3, color: gray[400], textAlign: 'center' }}
            >
              {`${stat.percent}%`}
            </Caption>
          </View>
        </View>
      ))}
    </View>
  );
};
