import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import SettingItem from './SettingItem.tsx';

interface SettingListItem {
  title: string;
  rightComponent: React.ReactNode;
  onPress?: () => void;
}

interface SettingListProps {
  items: SettingListItem[];
}

const SettingList = ({ items }: SettingListProps) => {
  return (
    <View className="bg-common-white rounded-xl">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            onPress={item.onPress}
            disabled={!item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <SettingItem
              title={item.title}
              rightComponent={item.rightComponent}
            />
          </TouchableOpacity>
          {index !== items.length - 1 && <View className="h-[1px] bg-gray-200" />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default SettingList;
