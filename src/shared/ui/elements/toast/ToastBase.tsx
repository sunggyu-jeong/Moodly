import { StyleSheet, View } from 'react-native';

import { common, gray } from '@/shared/styles/colors';
import { Body2 } from '@/shared/ui/typography/Body2';

interface ToastBaseProps {
  text: string;
}

const ToastBase = ({ text }: ToastBaseProps) => (
  <View style={styles.container}>
    <Body2
      weight="regular"
      style={styles.text}
    >
      {text}
    </Body2>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: gray[600],
    height: '100%',
    justifyContent: 'center',
  },
  text: {
    color: common.white,
  },
});

export default ToastBase;
