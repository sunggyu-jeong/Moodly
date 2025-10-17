import type { EmotionIconData } from '@/shared';
import { View } from 'react-native';

import EmotionSelectionIcon from './EmotionSelectionIcon';

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
