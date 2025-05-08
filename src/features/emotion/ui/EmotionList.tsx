import { View } from 'react-native';

import EmotionIcon from '@/features/emotion/ui/EmotionIcon';
import { EmotionIconData } from '@/shared/constants';

interface EmotionListProps {
  emotionList: EmotionIconData[];
}

const EmotionList = ({ emotionList }: EmotionListProps) => {
  return (
    <View className="flex flex-row flex-wrap mx-6">
      {emotionList.map(item => (
        <EmotionIcon
          key={item.id}
          emotion={item}
        />
      ))}
    </View>
  );
};

export default EmotionList;
