import { View } from 'react-native';

import { isNotEmpty } from '@shared/lib';

import { gray, primary } from '@shared/styles/colors';
import PopupButton from '@shared/ui/elements/ModalButton';

interface PopupFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText: string;
  confirmText: string;
}

const PopupFooter = ({ onCancel, onConfirm, cancelText, confirmText }: PopupFooterProps) => {
  return (
    <View className="h-[80px] justify-center items-center flex-row mx-9 gap-2 mt-4 mb-4">
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

export default PopupFooter;
