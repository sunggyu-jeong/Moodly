import { Image, TouchableOpacity, View } from 'react-native';

import { COMMON_ICONS } from '@/shared/assets/images/common';
import { Body1 } from '@/shared/ui/typography/Body1';

export interface SettingItemProps {
  title: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem = ({ ...props }: SettingItemProps) => {
  const Container = props.onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={props.onPress}
      className="flex-row items-center justify-between p-4"
    >
      <View className="flex-row items-center">
        {props.rightComponent && <View className="mr-4">{props.rightComponent}</View>}
        <Body1>{props.title}</Body1>
      </View>
      <Image source={COMMON_ICONS.iconNext} />
    </Container>
  );
};

export default SettingItem;
