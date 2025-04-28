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
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          disabled={!item.onPress}
          activeOpacity={item.onPress ? 0.7 : 1}
        >
          <SettingItem
            title={item.title}
            rightComponent={item.rightComponent}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SettingList;
