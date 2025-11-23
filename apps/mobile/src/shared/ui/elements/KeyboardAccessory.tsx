import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { getScaleSize } from '@/shared/hooks/useScale';
import { gray } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';

interface KeyboardAccessoryButtonProps {
  onPress: () => void;
}

export const KeyboardAccessoryButton = ({ onPress }: KeyboardAccessoryButtonProps) => (
  <View style={styles.container}>
    <TouchableWithoutFeedback onPress={onPress}>
      <H3
        weight="semibold"
        style={styles.text}
      >
        저장
      </H3>
    </TouchableWithoutFeedback>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    justifyContent: 'flex-start',
    borderTopWidth: 0.5,
    borderTopColor: '#C6C9D7',
    paddingTop: 12,
  },
  text: {
    color: gray[600],
    fontWeight: '600',
    marginRight: getScaleSize(20),
    textAlign: 'right',
  },
});
