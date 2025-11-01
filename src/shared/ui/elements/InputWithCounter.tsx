import { Caption } from '@/shared/ui/typography';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { gray } from '../../styles';

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
  const isBottomSheet = !!inputBackgroundColor;
  const InputComponent = isBottomSheet ? BottomSheetTextInput : TextInput;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: inputBackgroundColor ?? gray[100],
          marginBottom: inputBackgroundColor ? 80 : 0,
          marginTop: inputBackgroundColor ? 30 : 0,
        },
      ]}
    >
      <InputComponent
        value={value}
        maxLength={maxLength}
        style={styles.input}
        {...rest}
      />
      <Caption
        weight="regular"
        style={styles.textLength}
      >
        {`${value.length}/${maxLength}`}
      </Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gray[200],
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 60,
    marginLeft: 14,
  },
  textLength: {
    position: 'absolute',
    right: 0,
    top: 64,
    color: gray[400],
    textAlign: 'right',
  },
});
