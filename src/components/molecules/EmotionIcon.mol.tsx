import { useAppDispatch } from '../../hooks';
import { setSelectedIcon } from '../../redux/slice/diarySlice';
import EmotionSymbol from '../atoms/EmotionSymbol.atom';

export interface Emotions {
  id: number;
  icon: any;
  text: string;
  description: string;
}

const EmotionIcon = ({ emotion }: { emotion: Emotions }) => {
  const dispatch = useAppDispatch();

  const handleSelectEmotion = () => {
    console.log('>>>>', emotion);
    dispatch(setSelectedIcon(emotion));
  };

  return (
    <EmotionSymbol
      icon={emotion.icon}
      onPress={handleSelectEmotion}
    />
  );
};

export default EmotionIcon;
