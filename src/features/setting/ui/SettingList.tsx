import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import SettingItem from './SettingItem.tsx';

interface SettingListItem {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
}

interface SettingListProps {
  items: SettingListItem[];
}

const SettingList = ({ items }: SettingListProps) => {
  return (
    <View className="flex-1 gap-3">
      {items.map((item, index) => (
        <View className="bg-common-white rounded-xl">
          <React.Fragment key={index}>
            <TouchableOpacity
              onPress={item.onPress}
              disabled={!item.onPress}
              activeOpacity={item.onPress ? 0.7 : 1}
            >
              <SettingItem
                title={item.title}
                leftComponent={item.leftComponent}
                rightComponent={item.rightComponent}
              />
            </TouchableOpacity>
          </React.Fragment>
        </View>
      ))}
    </View>
  );
};

export default SettingList;
