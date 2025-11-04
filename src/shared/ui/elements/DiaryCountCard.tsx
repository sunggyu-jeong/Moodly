import { COMMON_ICONS } from '@/shared/assets/images/common';
import { useScale } from '@/shared/hooks/useScale';
import { common, gray } from '@/shared/styles/colors';
import { H2 } from '@/shared/ui/typography/H2';
import { Label } from '@/shared/ui/typography/Label';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface Props {
  count: number;
  onPress: () => void;
}

const DiaryCountCard = ({ count, onPress }: Props) => {
  const { getScaleSize } = useScale();

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.touchArea}
        activeOpacity={0.7}
      >
        {/* 왼쪽: 아이콘 + 텍스트 */}
        <View style={styles.leftGroup}>
          <Image
            source={COMMON_ICONS.iconWriteCircle}
            style={{
              width: getScaleSize(36),
              height: getScaleSize(36),
            }}
            resizeMode="contain"
          />
          <Label
            weight="regular"
            style={styles.labelStyle}
          >
            작성한 일기 수
          </Label>
        </View>

        {/* 오른쪽: 카운트 + 화살표 */}
        <View style={styles.rightGroup}>
          <H2
            weight="semibold"
            style={styles.countText}
          >
            {count}
          </H2>
          <Image
            source={COMMON_ICONS.iconNextGray}
            style={{
              width: getScaleSize(24),
              height: getScaleSize(24),
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: common.white,
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
  },
  touchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    marginLeft: 13,
    color: gray[500],
  },
  countText: {
    marginRight: 6,
    color: gray[600],
  },
});

export default DiaryCountCard;
