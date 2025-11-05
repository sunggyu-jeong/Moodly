import { StyleSheet, View } from 'react-native';

import { EMOTION_ICONS } from '@/shared/assets/images/emotion';
import { useAppSelector } from '@/shared/hooks/useHooks';
import { getScaleSize, useScale } from '@/shared/hooks/useScale';
import { gray } from '@/shared/styles/colors';
import AnimatedZoomImage from '@/shared/ui/elements/AnimatedZoomImage';
import { Body1 } from '@/shared/ui/typography/Body1';
import { H1 } from '@/shared/ui/typography/H1';

const EmotionDisplaySelected = () => {
  const selectedIcon = useAppSelector(state => state.diarySlice.selectedIcon);
  const { getScaleSize } = useScale();

  return (
    <View style={styles.contentStyle}>
      <AnimatedZoomImage
        source={selectedIcon?.iconBigShadow || EMOTION_ICONS.joyBigShadow}
        size={getScaleSize(196)}
      />
      <H1
        weight="semibold"
        style={styles.h1Style}
      >
        {selectedIcon?.text}
      </H1>
      <Body1
        weight="regular"
        style={styles.bodyStyle}
      >
        {selectedIcon?.description}
      </Body1>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyStyle: {
    color: gray[400],
    marginTop: getScaleSize(5),
  },
  contentStyle: {
    alignItems: 'center',
    marginTop: getScaleSize(66),
  },
  h1Style: {
    color: gray[600],
    marginTop: getScaleSize(34),
  },
});

export default EmotionDisplaySelected;
