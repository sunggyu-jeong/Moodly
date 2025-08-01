import { Caption } from '@/shared/ui/typography/Caption';
import { Dayjs } from 'dayjs';
import React from 'react';
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';

interface DayCellProps {
  date: Dayjs;
  isSelected: boolean;
  isFuture: boolean;
  iconSource: ImageSourcePropType | null;
  onPress: () => void;
}

const DayCell = ({ date, isSelected, isFuture, iconSource, onPress }: DayCellProps) => {
  return (
    <View className="items-center bg-common-transparent w-full h-full p-1">
      {isFuture ? (
        <View className="w-11 h-11 bg-gray-200 rounded-full" />
      ) : (
        <TouchableOpacity
          className="w-10 h-10"
          onPress={onPress}
          disabled={isFuture}
        >
          {iconSource ? (
            <Image
              source={iconSource}
              className="w-10 h-10"
              resizeMode="contain"
            />
          ) : (
            <View className="w-10 h-10" />
          )}
        </TouchableOpacity>
      )}

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
    </View>
  );
};

export default React.memo(DayCell);
