import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { COMMON_ICONS } from '@shared/assets/images/common';
import { getScaleSize } from '@shared/hooks';
import { gray } from '@shared/styles/colors.ts';
import { Body1 } from '@shared/ui/typography/Body1.tsx';

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
        <Body1
          weight="regular"
          style={styles.mentStyle}
        >
          {props.title}
        </Body1>
      </View>
      <Image
        source={COMMON_ICONS.iconNextGray}
        style={styles.image}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    height: getScaleSize(24),
    width: getScaleSize(10),
  },
  mentStyle: {
    color: gray[600],
  },
});

export default SettingItem;
