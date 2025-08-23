import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { gray } from '../../styles';
import { Caption } from '../typography';

interface InputWithCounterProps extends TextInputProps {
  value: string;
  maxLength: number;
  inputBackgroundColor?: string;
}

export const InputWithCounterProps = ({
  value,
  inputBackgroundColor,
  maxLength,
  ...rest
}: InputWithCounterProps) => {
  const styles = StyleSheet.create({
    textLengthStyle: {
      textAlign: 'right',
      marginTop: 8,
    },
    inputContainer: {
      backgroundColor: inputBackgroundColor ?? gray[100],
      marginBottom: inputBackgroundColor ? 80 : 0,
      marginTop: inputBackgroundColor ? 30 : 0,
    },
  });
  const isBottomSheet = !!inputBackgroundColor;
  const InputComponent = isBottomSheet ? BottomSheetTextInput : TextInput;

  return (
    <View
      className="w-full h-[60px] rounded-xl border border-b-gray-200 border-gray-200"
      style={styles.inputContainer}
    >
      <InputComponent
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
