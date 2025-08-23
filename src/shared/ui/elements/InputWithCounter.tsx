import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { StyleSheet, type TextInputProps, View } from 'react-native';

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
      borderWidth: inputBackgroundColor ? 1 : 0,
      borderColor: gray[200],
    },
  });

  return (
    <View
      className="w-full h-[60px] rounded-xl border-gray-200 mb-[80px]"
      style={styles.inputContainer}
    >
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
