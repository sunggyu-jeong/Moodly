import { useEffect, useState } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';

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
      className={`w-11 h-6 rounded-full ${isOn ? 'bg-primary-300' : 'bg-gray-300'}`}
    >
      <Animated.View
        className="ml-[1px] mt-[1.5px] w-5 h-5 rounded-full bg-common-white absolute"
        style={{ transform: [{ translateX }] }}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
