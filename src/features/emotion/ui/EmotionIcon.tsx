import { setSelectedIcon } from '@/features/diary/model/diary.slice';
import { useAppDispatch } from '@/shared/hooks';
import EmotionSymbol from '@/shared/ui/elements/EmotionSymbol';

export interface Emotions {
  id: number;
  icon: any;
  text: string;
  description: string;
}

const EmotionIcon = ({ emotion }: { emotion: Emotions }) => {
  const dispatch = useAppDispatch();

  const handleSelectEmotion = () => {
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
