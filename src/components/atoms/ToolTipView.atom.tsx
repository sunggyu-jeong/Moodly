import { useScale } from "../../hooks";
import { Text, View, ViewProps } from "react-native";

const ToolTipView = ({ style }: ViewProps) => {
  const { getScaleSize } = useScale();

  return (
    <View className="w-full h-[87px]" style={style}>
      <View className="h-[63px] bg-[#F4F1EC] rounded-[29px] justify-center items-center">
        <Text 
          className="text-pretendard font-semibold tracking-[-0.5px] text-center"
          style={{ fontSize: getScaleSize(21) }}
        >        
          어떤 일이 있었는지 말해줄래?
        </Text>
      </View>
      <View className="w-full items-center mt-[0px]">
        <View
          className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#F3F1EC]"
        />
      </View>
    </View>
  )
}

export default ToolTipView;