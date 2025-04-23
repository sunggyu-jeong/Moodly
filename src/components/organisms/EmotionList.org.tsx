import { View } from 'react-native';
import { useScale } from '../../hooks';
import EmotionIcon, { Emotions } from '../molecules/EmotionIcon.mol';

interface EmotionListProps {
  emotionList: Emotions[];
}

const EmotionList = ({ emotionList }: EmotionListProps) => {
  const { getScaleSize } = useScale();
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
