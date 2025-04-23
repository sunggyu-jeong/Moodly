import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { IMAGES } from '../../assets/images';
import { getScaleSize } from '../../hooks';

export interface SelectableSettingProps {
  title: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
}

const SelectableSetting = ({
  title,
  rightComponent,
  onPress,
}: SelectableSettingProps) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className="flex-row items-center justify-between p-4"
    >
      <View className="flex-row items-center">
        {rightComponent && <View>{rightComponent}</View>}
        <Text
          numberOfLines={1}
          className="font-normal font-pretendard tracking-[-0.5px] ml-4"
          style={{ fontSize: getScaleSize(16) }}
        >
          {title}
        </Text>
      </View>
      <Image source={IMAGES.right} />
    </Container>
  );
};

export default SelectableSetting;
