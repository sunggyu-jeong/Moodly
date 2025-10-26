import { colors } from '@/shared/styles';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';

interface ToggleProps {
  onToggle: () => void;
  isOn: boolean;
}

const Toggle = ({ onToggle, isOn }: ToggleProps) => {
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
    outputRange: [1, 17],
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[styles.container, { backgroundColor: isOn ? colors.primary[300] : colors.gray[300] }]}
    >
      <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 9999,
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: colors.common.white,
    marginLeft: 1,
    marginTop: 1.5,
  },
});

export default Toggle;
