import { useAppDispatch } from "../../hooks";
import { setSelectedIcon } from "../../redux/slice/diarySlice";
import EmotionIconAtom from "../atoms/EmotionIcon.atom";

export interface Emotions {
  id: number;
  icon: any;
  text: string;
  description: string;
}

const EmotionIcon = ({ emotion }: { emotion: Emotions }) => {
  const dispatch = useAppDispatch();

  const handleSelectEmotion = () => {
    console.log(">>>>", emotion)
    dispatch(setSelectedIcon(emotion));
  };

  return <EmotionIconAtom icon={emotion.icon} onPress={handleSelectEmotion} />;
};

export default EmotionIcon;