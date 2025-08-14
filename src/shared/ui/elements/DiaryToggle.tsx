import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

import { colors } from '@/shared/styles';

import { Caption } from '../typography/Caption';

interface ToggleProps {
  onToggle?: () => void;
  isOn: boolean;
  texts: string[];
}
const DiaryToggle = ({ onToggle, isOn, texts }: ToggleProps) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 36],
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`w-[78px] h-6 rounded-full bg-gray-300`}
    >
      <View className="flex-1 flex-row justify-between items-center ml-3 mr-2.5">
        {texts.map((el, idx) => {
          const isActive = idx === (isOn ? 1 : 0);
          return (
            <Caption
              key={idx}
              weight="semibold"
              style={{
                ...styles.toggleLabel,
                color: isActive ? colors.common.white : colors.gray[400],
              }}
            >
              {el}
            </Caption>
          );
        })}
      </View>

      <Animated.View
        className="w-[42px] h-6 rounded-full bg-gray-500 absolute"
        style={{ transform: [{ translateX }] }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleLabel: {
    zIndex: 999,
  },
});

export default React.memo(DiaryToggle);
