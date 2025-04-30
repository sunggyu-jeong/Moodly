import { View } from 'react-native';

import { isNotEmpty } from '@shared/lib';

import PopupButton from '@/shared/ui/elements/ModalButton';

interface PopupFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText: string;
  confirmText: string;
}

const PopupFooter = ({
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
}: PopupFooterProps) => {
  return (
    <View className="h-[80px] justify-center items-center flex-row mx-9 gap-[10px]">
      {isNotEmpty(cancelText) && (
        <PopupButton
          text={cancelText}
          textColor="#212123"
          onPress={onCancel}
        />
      )}
      {isNotEmpty(confirmText) && (
        <PopupButton
          text={confirmText}
          textColor="white"
          bgColor="#212123"
          onPress={onConfirm}
        />
      )}
    </View>
  );
};

export default PopupFooter;
