import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { StyleSheet, type TextInputProps, View } from 'react-native';

import { Caption } from '../typography';

interface InputWithCounterProps extends TextInputProps {
  value: string;
  maxLength: number;
}

export const InputWithCounterProps = ({ value, maxLength, ...rest }: InputWithCounterProps) => {
  return (
    <View className="w-full h-[60px] rounded-xl border-gray-200 border-b bg-gray-100">
      <BottomSheetTextInput
        className="w-full h-[60px] ml-[26px]"
        value={value}
        maxLength={maxLength}
        {...rest}
      />
      <Caption
        weight="regular"
        style={styles.textLengthStyle}
      >{`${value.length}/${maxLength}`}</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  textLengthStyle: {
    textAlign: 'right',
  },
});
