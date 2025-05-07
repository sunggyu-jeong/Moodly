import { setSelectedIcon } from '@/features/diary/model/diary.slice';
import { EmotionIconData } from '@/shared/constants';
import { useAppDispatch } from '@/shared/hooks';
import EmotionSymbol from '@/shared/ui/elements/EmotionSymbol';

const EmotionIcon = ({ emotion }: { emotion: EmotionIconData }) => {
  const dispatch = useAppDispatch();

  const handleSelectEmotion = () => {
    dispatch(setSelectedIcon(emotion));
  };

  return (
    <EmotionSymbol
      icon={emotion.iconBig}
      onPress={handleSelectEmotion}
    />
  );
};

export default EmotionIcon;
