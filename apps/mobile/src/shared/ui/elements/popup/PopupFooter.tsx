import { StyleSheet, View } from 'react-native';

import { isNotEmpty } from '@/shared/lib/value.util';
import { gray, primary } from '@/shared/styles/colors';
import PopupButton from '@/shared/ui/elements/PopupButton';

interface PopupFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText: string;
  confirmText: string;
}

const PopupFooter = ({ onCancel, onConfirm, cancelText, confirmText }: PopupFooterProps) => {
  return (
    <View style={styles.container}>
      {isNotEmpty(cancelText) && (
        <PopupButton
          text={cancelText}
          textColor={gray[900]}
          bgColor={gray[100]}
          onPress={onCancel}
        />
      )}
      {isNotEmpty(confirmText) && (
        <PopupButton
          text={confirmText}
          textColor="white"
          bgColor={primary[300]}
          onPress={onConfirm}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 36,
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
});

export default PopupFooter;
