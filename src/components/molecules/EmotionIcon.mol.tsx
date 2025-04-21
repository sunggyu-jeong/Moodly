import { useAppDispatch } from "../../hooks";
import { setSelectedEmotion } from "../../redux/slice/diarySlice";
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
    dispatch(setSelectedEmotion(emotion));
  };

  return <EmotionIconAtom icon={emotion.icon} onPress={handleSelectEmotion} />;
};

export default EmotionIcon;