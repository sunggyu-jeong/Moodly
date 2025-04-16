import { Text, View } from "react-native";

interface PopupHeaderProps {
  title: string;
  message: string;
}
const PopupHeader = ({ ...props }: PopupHeaderProps) => {
  return (
    <View className="mt-10">
      <Text className="font-pretendard font-bold text-xl tracking-[-0.5px] color-black"> 
        {props.title}
      </Text>
      <Text className="mt-2 font-pretendard font-normal text-sm tracking-[-0.5px] color-[#9E9EA1]"> 
        {props.message}
      </Text>
    </View>
  )
}

export default PopupHeader;