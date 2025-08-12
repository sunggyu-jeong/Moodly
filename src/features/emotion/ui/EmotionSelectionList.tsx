import EmotionSelectionIcon from '@features/emotion/ui/EmotionSelectionIcon.tsx';
import { EmotionIconData } from '@shared/constants';
import { View } from 'react-native';

interface EmotionListProps {
  emotionList: EmotionIconData[];
}

const EmotionSelectionList = ({ emotionList }: EmotionListProps) => {
  return (
    <View className="flex flex-row flex-wrap mx-6">
      {emotionList.map(item => (
        <EmotionSelectionIcon
          key={item.id}
          emotion={item}
        />
      ))}
    </View>
  );
};

export default EmotionSelectionList;
