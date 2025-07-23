import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { COMMON_ICONS } from '../../assets/images/common';
import { ICON_DATA } from '../../constants';
import { isEmpty } from '../../lib';
import { gray } from '../../styles/colors';
import { Caption } from '../typography/Caption';

interface CalendarIconProps {
  iconId?: number | undefined;
}

const CalendarIcon = ({ iconId }: CalendarIconProps) => {
  const emotionSource = ICON_DATA.find(item => item.id === iconId);
  return (
    <>
      <View className="flex flex-col items-center bg-common-white w-full h-full p-1">
        {iconId && (
          <Image
            source={emotionSource?.iconSelected}
            className="w-full h-full"
            resizeMode="contain"
          />
        )}
        {isEmpty(iconId) && (
          <TouchableOpacity
            className="w-full h-full"
            onPress={() => {}}
          >
            <Image
              source={COMMON_ICONS.iconAddDiary}
              className="w-full h-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <Caption
          weight="regular"
          style={{ color: gray[500] }}
        >
          {'23'}
        </Caption>
      </View>
    </>
  );
};

export default React.memo(CalendarIcon);
