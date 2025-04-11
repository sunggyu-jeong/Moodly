import { useAppDispatch } from "../../hooks";
import { setSelectedEmotion } from "../../redux/slice/diarySlice";
import { Image, Pressable, View } from "react-native";

export interface Emotions {
  id: number;
  icon: any;
  text: string;
  description: string;
}

const EmotionIcon = ({ emotion }: { emotion: Emotions }) => {
  const dispatch = useAppDispatch();

  const handleSelectEmotion = (item: Emotions) => {
    dispatch(setSelectedEmotion(item));
  }

  return (
    <View
      key={emotion.id}
      className="w-[20%] my-[5px] items-center justify-center h-[50px] aspect-square"
    >
      <Pressable onPress={() => { handleSelectEmotion(emotion) }}>
        <Image
          source={emotion.icon} 
          style={{ width: 48, height: 48, aspectRatio: 1 }}  />
      </Pressable>
    </View>
  )
}

export default EmotionIcon;