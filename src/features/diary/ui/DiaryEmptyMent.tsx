import { Image, StyleSheet, View } from 'react-native';

import { MAIN_ICONS } from '../../../shared/assets/images/main';
import colors from '../../../shared/styles/colors';
import { Body1 } from '../../../shared/ui/typography/Body1';

const DiaryEmptyMent = () => {
  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <Image source={MAIN_ICONS.avatarEmpty} />
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
});

export default DiaryEmptyMent;
