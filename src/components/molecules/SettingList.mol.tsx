import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import SettingItemAtom from '../atoms/SettingItem.atom';

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
    <View className="flex-1">
      {items.map((item, index) => {
        const content = (
          <SettingItemAtom
            key={index}
            title={item.title}
            rightComponent={item.rightComponent}
          />
        );
        return item.onPress ? (
          //activeOpacity={1}
          <TouchableOpacity key={index} onPress={item.onPress}>
            {content}
          </TouchableOpacity>
        ) : (
          content
        );
      })}
    </View>
  );
};

export default SettingList;