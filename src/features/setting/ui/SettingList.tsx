import { TouchableOpacity, View } from 'react-native';

import type { SettingItemProps } from '../types';
import SettingItem from './SettingItem';

interface SettingListProps {
  header?: SettingItemProps[];
  groups?: SettingItemProps[][];
}

const SettingList = ({ header, groups }: SettingListProps) => {
  return (
    <View className="flex-1 gap-4">
      {header?.map((item, index) => (
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
      {groups?.map((group, groupIndex) => (
        <View
          key={groupIndex}
          className="bg-common-white rounded-xl overflow-hidden"
        >
          {group.map((item, itemIndex) => (
            <View key={itemIndex}>
              <TouchableOpacity
                onPress={item.onPress}
                disabled={!item.onPress}
                activeOpacity={item.onPress ? 0.7 : 1}
              >
                <SettingItem {...item} />
              </TouchableOpacity>
              {itemIndex < group.length - 1 && <View className="w-full h-px bg-gray-200" />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default SettingList;
