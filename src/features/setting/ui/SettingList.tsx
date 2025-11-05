import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { common, gray } from '@/shared/styles/colors';

import type { SettingItemProps } from '../types';
import SettingItem from './SettingItem';

interface SettingListProps {
  header?: SettingItemProps[];
  groups?: SettingItemProps[][];
}

const SettingList = ({ header, groups }: SettingListProps) => {
  return (
    <View style={styles.container}>
      {header?.map((item, index) => (
        <View
          style={styles.headerBox}
          key={index}
        >
          <TouchableOpacity
            onPress={item.onPress}
            disabled={!item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <SettingItem
              key={item.key}
              title={item.title}
              leftComponent={item.leftComponent}
              rightComponent={item.rightComponent}
              titleStyle={item.titleStyle}
            />
          </TouchableOpacity>
        </View>
      ))}

      {groups?.map((group, groupIndex) => (
        <View
          style={styles.groupBox}
          key={groupIndex}
        >
          {group.map(({ key, ...rest }, itemIndex) => (
            <View key={key}>
              <TouchableOpacity
                onPress={rest.onPress}
                disabled={!rest.onPress}
                activeOpacity={rest.onPress ? 0.7 : 1}
              >
                <SettingItem
                  key={key}
                  {...rest}
                />
              </TouchableOpacity>
              {itemIndex < group.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  headerBox: {
    backgroundColor: common.white,
    borderRadius: 12,
  },
  groupBox: {
    backgroundColor: common.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: gray[200],
  },
});

export default SettingList;
