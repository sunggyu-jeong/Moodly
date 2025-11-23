import { memo, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

import colors, { gray } from '@/shared/styles/colors';
import { Caption } from '@/shared/ui/typography/Caption';

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
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        {texts.map((text, index) => {
          const isActive = index === (isOn ? 1 : 0);
          return (
            <Caption
              key={index}
              weight="semibold"
              style={[styles.label, { color: isActive ? colors.common.white : colors.gray[400] }]}
            >
              {text}
            </Caption>
          );
        })}
      </View>

      <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 78,
    height: 24,
    borderRadius: 9999,
    backgroundColor: gray[300],
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 10,
  },
  label: {
    zIndex: 2,
  },
  toggleThumb: {
    position: 'absolute',
    width: 42,
    height: 24,
    borderRadius: 9999,
    backgroundColor: gray[500],
  },
});

export default memo(DiaryToggle);
