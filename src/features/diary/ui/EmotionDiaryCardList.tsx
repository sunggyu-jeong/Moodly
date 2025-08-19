import { Diary } from '@entities/diary/model/diary.types';
import { setSelectedDiary } from '@features/diary/model/diarySlice';
import { useAppDispatch } from '@shared/hooks';
import { isEmpty, navigate } from '@shared/lib';
import { TouchableOpacity, View } from 'react-native';

import EmotionDiaryCardContent from './EmotionDiaryCardContent';
import EmotionDiaryCardHeader from './EmotionDiaryCardHeader';

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
      <View className="flex-1 justify-start items-stretch w-full">
        <TouchableOpacity
          onPress={() => {
            handleDiaryDetail(data);
          }}
          key={data.emotionId}
        >
          <View
            key={data.emotionId}
            className="bg-common-white py-5 px-[18px] mb-4 rounded-[15px]"
          >
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

export default EmotionDiaryCardList;
