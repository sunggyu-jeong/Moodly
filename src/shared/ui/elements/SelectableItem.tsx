import { Image, StyleSheet, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
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
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.container}>
      <Label
        weight="semibold"
        style={[styles.label, { color: textColor }]}
      >
        {text}
      </Label>
      <Image
        source={source}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginLeft: 16,
  },
  icon: {
    marginRight: 16,
    width: 24,
    height: 24,
  },
});

export default SelectableItem;
