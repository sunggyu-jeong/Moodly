import { setSelectedIcon } from '@/features/diary/model/diary.slice';
import { EmotionIconData } from '@/shared/constants';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import EmotionSymbol from '@/shared/ui/elements/EmotionSymbol';

const EmotionIcon = ({ emotion }: { emotion: EmotionIconData }) => {
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector(state => state.diarySlice.selectedIcon);

  const handleSelectEmotion = () => {
    dispatch(setSelectedIcon(emotion));
  };

  return (
    <EmotionSymbol
      icon={
        selectedEmotion?.id === emotion.id ? emotion.iconSelected : emotion.iconUnSelected
      }
      onPress={handleSelectEmotion}
    />
  );
};

export default EmotionIcon;
