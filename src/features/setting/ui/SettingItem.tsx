import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { gray } from '@shared/styles/colors.ts';
import { Body1 } from '@shared/ui/typography/Body1.tsx';
import { SettingItemProps } from '../types';

const SettingItem = ({ titleStyle, ...props }: SettingItemProps) => {
  const Container = props.onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={props.onPress}
      className="flex-row items-center p-4"
    >
      <View className="flex-row items-center flex-1">
        {props.leftComponent && <View className="mr-4 w-full">{props.leftComponent}</View>}
        {props.title && (
          <Body1
            weight="regular"
            style={[styles.mentStyle, titleStyle]}
          >
            {props.title}
          </Body1>
        )}
      </View>
      {props.rightComponent && <View className="mr-2">{props.rightComponent}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  mentStyle: {
    color: gray[600],
  },
});

export default SettingItem;
