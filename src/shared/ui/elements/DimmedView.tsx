import { TouchableOpacity, View } from 'react-native';

interface DimmedViewProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const DimmedView = ({ ...props }: DimmedViewProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={1}
      className="flex-1"
    >
      <View className="flex-1 bg-common-black/40">{props.children}</View>
    </TouchableOpacity>
  );
};

export default DimmedView;
