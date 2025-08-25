import { selectIsDiaryPagingLoading } from '@features/calendar';
import { Dayjs } from 'dayjs';
import { memo } from 'react';
import { Image, type ImageSourcePropType, TouchableOpacity, View } from 'react-native';

import { useAppSelector, useDelay } from '../../hooks';
import { Caption } from '../typography';
import DayCellSkeleton from './Skeleton/DayCellSkeleton';

interface DayCellProps {
  date: Dayjs;
  isSelected: boolean;
  isFuture: boolean;
  iconSource: ImageSourcePropType | null;
  onPress: () => void;
}

const DayCell = ({ date, isSelected, isFuture, iconSource, onPress }: DayCellProps) => {
  const isDiaryLoading = useAppSelector(selectIsDiaryPagingLoading);
  const isDelayedLoading = useDelay(isDiaryLoading);
  const renderIcon = () => {
    if (isFuture) {
      return <View className="w-11 h-11 bg-gray-200 rounded-full" />;
    }
    if (iconSource) {
      return (
        <Image
          source={iconSource}
          className="w-10 h-10"
          resizeMode="contain"
        />
      );
    }
    return <View className="w-10 h-10" />;
  };
  return (
    <View className="items-center bg-common-transparent w-full h-full p-1">
      {isDelayedLoading ? (
        <DayCellSkeleton />
      ) : (
        <>
          <TouchableOpacity
            className="w-10 h-10"
            onPress={onPress}
          >
            {renderIcon()}
          </TouchableOpacity>

          <View
            className={
              isSelected
                ? 'bg-primary-300 rounded-full w-5/6 items-center mt-2'
                : 'w-full px-2 items-center mt-2'
            }
          >
            <Caption
              weight="regular"
              className={isSelected ? 'text-common-white' : 'text-gray-500'}
            >
              {date.date() < 10 ? date.format('D') : date.format('DD')}
            </Caption>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(DayCell);
