import { View } from 'react-native';
import EmotionIcon, { Emotions } from '../../../components/molecules/EmotionIcon';
import { getScaleSize } from '../../../hooks';

interface EmotionListProps {
  emotionList: Emotions[];
}

const EmotionList = ({ emotionList }: EmotionListProps) => {
  return (
    <View
      className="flex flex-row flex-wrap mx-6"
      style={{ marginBottom: getScaleSize(63) }}
    >
      {emotionList.map((item) => (
        <EmotionIcon
          key={item.id}
          emotion={item}
        />
      ))}
    </View>
  );
};

export default EmotionList;
