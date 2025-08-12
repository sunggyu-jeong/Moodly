import { COMMON_ICONS } from '@shared/assets/images/common';
import { useScale } from '@shared/hooks';
import { H2 } from '@shared/ui/typography/H2';
import { Label } from '@shared/ui/typography/Label';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '../../styles/colors';

interface Props {
  count: number;
  onPress: () => void;
}

const DiaryCountCard = ({ count, onPress }: Props) => {
  const { getScaleSize } = useScale();
  return (
    <View className="bg-common-white w-full mb-4 rounded-xl">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row justify-between items-center w-full px-4 py-2"
      >
        <View className="flex-row items-center">
          <Image
            source={COMMON_ICONS.iconWriteCircle}
            style={{ width: getScaleSize(36), height: getScaleSize(36) }}
          />
          <Label
            weight="regular"
            style={[styles.labelStyle, { color: colors.gray[500] }]}
          >
            작성한 일기 수
          </Label>
        </View>
        <View className="flex-row items-center">
          <H2
            weight="semibold"
            style={styles.h2MarginRight}
          >
            {count}
          </H2>
          <Image
            source={COMMON_ICONS.iconNextGray}
            style={{ width: getScaleSize(24), height: getScaleSize(24) }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  h2MarginRight: {
    marginRight: 6,
  },
  labelStyle: {
    marginLeft: 13,
  },
});

export default DiaryCountCard;
