import { EmotionIconData } from '@/shared/constants/icons';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import EmotionSymbol from '@/shared/ui/elements/EmotionSymbol';

import { setSelectedIcon } from '../../diary/model/diarySlice';

const EmotionSelectionIcon = ({ emotion }: { emotion: EmotionIconData }) => {
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector(state => state.diary.selectedIcon);

  const handleSelectEmotion = () => {
    dispatch(setSelectedIcon(emotion));
  };

  return (
    <EmotionSymbol
      icon={selectedEmotion?.id === emotion.id ? emotion.iconSelected : emotion.iconUnSelected}
      onPress={handleSelectEmotion}
    />
  );
};

export default EmotionSelectionIcon;
