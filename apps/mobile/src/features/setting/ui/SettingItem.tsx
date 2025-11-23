import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { gray } from '@/shared/styles/colors';
import { Body1 } from '@/shared/ui/typography/Body1';

import type { SettingItemProps } from '../types';

const SettingItem = ({ titleStyle, ...props }: SettingItemProps) => {
  const Container = props.onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={props.onPress}
      style={styles.container}
    >
      <View style={styles.row}>
        {props.leftComponent && <View style={styles.left}>{props.leftComponent}</View>}
        {props.title && (
          <Body1
            weight="regular"
            style={[styles.text, titleStyle]}
          >
            {props.title}
          </Body1>
        )}
      </View>
      {props.rightComponent && <View style={styles.right}>{props.rightComponent}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  left: {
    marginRight: 16,
    width: '100%',
  },
  right: {
    marginRight: 8,
  },
  text: {
    color: gray[600],
  },
});

export default SettingItem;
