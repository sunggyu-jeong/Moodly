import { View } from 'react-native';

import { EMOTION_ICONS } from '@shared/assets/images/emotion';
import { useAppSelector, useScale } from '@shared/hooks';
import AnimatedZoomImage from '@shared/ui/elements/AnimatedZoomImage';

import { gray } from '@/shared/styles/colors';
import { Body1 } from '@/shared/ui/typography/Body1';
import { H1 } from '@/shared/ui/typography/H1';

const SelectedEmotion = () => {
  const selectedIcon = useAppSelector(state => state.diarySlice.selectedIcon);
  const { getScaleSize } = useScale();

  return (
    <View
      className="items-center"
      style={{ marginTop: getScaleSize(66) }}
    >
      <AnimatedZoomImage
        source={selectedIcon?.iconBigShadow || EMOTION_ICONS.joyBigShadow}
        size={getScaleSize(196)}
      />
      <H1
        weight="semibold"
        style={{ color: gray[600], marginTop: getScaleSize(34) }}
      >
        {selectedIcon?.text}
      </H1>
      <Body1
        weight="regular"
        style={{ color: gray[400], marginTop: getScaleSize(5) }}
      >
        {selectedIcon?.description}
      </Body1>
    </View>
  );
};

export default SelectedEmotion;
