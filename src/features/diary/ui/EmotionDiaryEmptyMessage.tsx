import { Image, StyleSheet, View } from 'react-native';

import { MAIN_ICONS } from '@shared/assets/images/main';
import { getScaleSize } from '@shared/hooks';
import colors from '@shared/styles/colors.ts';
import { Body1 } from '@shared/ui/typography/Body1.tsx';

const EmotionDiaryEmptyMessage = () => {
  return (
    <View className="items-center">
      <Image
        source={MAIN_ICONS.avatarEmpty}
        style={styles.imageStyle}
      />
      <Body1
        weight="regular"
        style={styles.bodyText}
      >
        작성된 일기가 없어요
      </Body1>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyText: {
    color: colors.gray[400],
    marginTop: 6,
  },
  imageStyle: {
    height: getScaleSize(90),
    width: getScaleSize(90),
  },
});

export default EmotionDiaryEmptyMessage;
