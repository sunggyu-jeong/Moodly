import { Image, type ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Label } from '../typography/Label';

const SelectableItem = ({
  text,
  source,
  textColor,
  onPress,
}: {
  text: string;
  source: ImageSourcePropType;
  textColor?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View className="h-[48px] flex-row items-center justify-between">
      <Label
        weight="semibold"
        style={[styles.label, { color: textColor }]}
      >
        {text}
      </Label>
      <Image
        className="mr-4 w-6 h-6"
        source={source}
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  label: {
    marginLeft: 16,
  },
});

export default SelectableItem;
