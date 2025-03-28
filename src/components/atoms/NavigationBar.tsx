import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isNotEmpty } from '../../utils';

export interface NavigationBarProps {
  showBackButton?: boolean;
  title?: string;
  rightItems?: React.ReactNode[];
}

const NavigationBar = ({
  showBackButton = true,
  title = '',
  rightItems = []
}: NavigationBarProps) => {
  const navigation = useNavigation();

  return (
    <View className="h-14 flex-row items-center justify-between px-[10px] bg-[#f5f5f5] border-b border-[#ddd]">
      {showBackButton ? (
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          {/** FIXME: - 아이콘 나오면 아이콘으로 변경할 것. */}
          <Text className='text-[18px]'>{'<'}</Text>
        </TouchableOpacity>
      ) : (
        <View className='w-8' />
      )}

      <Text className="text-lg font-bold">{title}</Text>

      <View className="flex-row items-center">
        {isNotEmpty(rightItems) && rightItems.map((item, index) => (
          <View key={index} className="ml-[10px]">
            {item}
          </View>
        ))}
      </View>
    </View>
  );
};

export default NavigationBar;