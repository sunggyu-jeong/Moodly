import type { Diary } from '@/entities/diary/model/diary.types';
import { setSelectedDiary } from '@/features/diary/model/diarySlice';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import EmotionDiaryCardContent from './EmotionDiaryCardContent';
import EmotionDiaryCardHeader from './EmotionDiaryCardHeader';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { navigate } from '@/shared/lib/navigation.util';
import { isEmpty } from '@/shared/lib/value.util';

interface EmotionDiaryCardListProps {
  data: Diary | undefined;
}

const EmotionDiaryCardList = ({ data }: EmotionDiaryCardListProps) => {
  const dispatch = useAppDispatch();

  const handleDiaryDetail = (item: Diary) => {
    dispatch(setSelectedDiary(item));
    navigate('EmotionDiaryDetailPage', { origin: 'RootStack' });
  };

  if (isEmpty(data)) {
    return <></>;
  }

  return (
    <>
      <View style={styles.StyledContainer}>
        <TouchableOpacity
          onPress={() => {
            handleDiaryDetail(data);
          }}
          key={data.emotionId}
        >
          <View style={styles.StyledCard}>
            <EmotionDiaryCardHeader
              iconId={data.iconId}
              recordDate={data.recordDate}
            />
            <EmotionDiaryCardContent content={data.description ?? ''} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
  },
  StyledCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderRadius: 15,
  },
});

export default EmotionDiaryCardList;
