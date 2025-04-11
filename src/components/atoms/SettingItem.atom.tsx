import { useScale } from '../../hooks';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface SettingItemAtomProps {
  title: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
}

const SettingItemAtom = ({ title, rightComponent, onPress }: SettingItemAtomProps) => {
  const Container = onPress ? TouchableOpacity : View;
  const { getScaleSize } = useScale();

  return (
    <Container
      onPress={onPress}
      className="flex-row items-center justify-between p-4"
    >
      <Text 
        className="font-semibold"
        style={{ fontSize: getScaleSize(16) }}
      >
        {title}
      </Text>
      {rightComponent && <View>{rightComponent}</View>}
    </Container>
  );
};

export default SettingItemAtom;