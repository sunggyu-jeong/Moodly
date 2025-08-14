import { TouchableOpacity, View } from 'react-native';

import { SettingItemProps } from '../types';
import SettingItem from './SettingItem';

interface SettingListProps {
  items: SettingItemProps[];
}

const SettingList = ({ items }: SettingListProps) => {
  return (
    <View className="flex-1 gap-3">
      {items.map((item, index) => (
        <View
          className="bg-common-white rounded-xl"
          key={index}
        >
          <View key={index}>
            <TouchableOpacity
              onPress={item.onPress}
              disabled={!item.onPress}
              activeOpacity={item.onPress ? 0.7 : 1}
            >
              <SettingItem
                title={item.title}
                leftComponent={item.leftComponent}
                rightComponent={item.rightComponent}
                titleStyle={item.titleStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SettingList;
