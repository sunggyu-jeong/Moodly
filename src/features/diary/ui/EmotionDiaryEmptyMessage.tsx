import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks/useScale';
import colors from '@/shared/styles/colors';
import { Body1 } from '@/shared/ui/typography/Body1';
import { Image, StyleSheet, View } from 'react-native';

const EmotionDiaryEmptyMessage = () => {
  return (
    <View style={styles.StyledContainer}>
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
  StyledContainer: {
    alignItems: 'center',
  },
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
