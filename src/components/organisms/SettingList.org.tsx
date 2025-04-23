import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SettingItem from '../molecules/SettingItem.mol';

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
          <SettingItem
            key={index}
            title={item.title}
            rightComponent={item.rightComponent}
          />
        );
        return item.onPress ? (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
          >
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
