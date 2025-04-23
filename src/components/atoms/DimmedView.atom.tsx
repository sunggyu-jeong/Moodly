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
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
        {props.children}
      </View>
    </TouchableOpacity>
  );
};

export default DimmedView;
