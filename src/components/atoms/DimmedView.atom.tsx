import { TouchableOpacity, View } from "react-native";

interface DimmedViewProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const DimmedViewAtom = ({ ...props }: DimmedViewProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View 
        className="w-full h-full"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        { props.children }
      </View>
    </TouchableOpacity>
  )
}

export default DimmedViewAtom;