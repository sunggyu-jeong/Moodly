import { StyleSheet, View } from 'react-native';
import EmotionSelectionIcon from './EmotionSelectionIcon';
import { EmotionIconData } from '@/shared/constants/Icons';

interface EmotionListProps {
  emotionList: EmotionIconData[];
}

const EmotionSelectionList = ({ emotionList }: EmotionListProps) => {
  return (
    <View style={styles.StyledContainer}>
      {emotionList.map(item => (
        <EmotionSelectionIcon
          key={item.id}
          emotion={item}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 24,
  },
});

export default EmotionSelectionList;
