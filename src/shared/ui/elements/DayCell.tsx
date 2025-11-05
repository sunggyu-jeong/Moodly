import { Dayjs } from 'dayjs';
import { memo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';

import { common, gray, primary } from '@/shared/styles/colors';
import { Caption } from '@/shared/ui/typography/Caption';

interface DayCellProps {
  date: Dayjs;
  isSelected: boolean;
  isFuture: boolean;
  iconSource: ImageSourcePropType | null;
  onPress: () => void;
}

const DayCell = ({ date, isSelected, isFuture, iconSource, onPress }: DayCellProps) => {
  const renderIcon = () => {
    if (isFuture) {
      return <View style={styles.futureIcon} />;
    }
    if (iconSource) {
      return (
        <Image
          source={iconSource}
          style={styles.icon}
          resizeMode="contain"
        />
      );
    }
    return <View style={styles.icon} />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchArea}
        onPress={onPress}
      >
        {renderIcon()}
      </TouchableOpacity>

      <View style={[styles.dateWrapper, isSelected && styles.dateWrapperSelected]}>
        <Caption
          weight="regular"
          style={isSelected ? styles.dateSelected : styles.dateText}
        >
          {date.date() < 10 ? date.format('D') : date.format('DD')}
        </Caption>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    padding: 4,
  },
  touchArea: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  futureIcon: {
    width: 44,
    height: 44,
    backgroundColor: gray[200],
    borderRadius: 9999,
  },
  icon: {
    width: 40,
    height: 40,
  },
  dateWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  dateWrapperSelected: {
    backgroundColor: primary[300],
    borderRadius: 9999,
    width: '83%',
  },
  dateText: {
    color: gray[500],
  },
  dateSelected: {
    color: common.white,
  },
});

export default memo(DayCell);
