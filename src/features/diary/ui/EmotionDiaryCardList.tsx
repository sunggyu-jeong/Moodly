import { TouchableOpacity, View } from 'react-native';

import { EmotionDiaryDTO } from '@entities/diary';
import { setSelectedDiary } from '@features/diary/model/diary.slice.ts';
import { useAppDispatch } from '@shared/hooks';
import { navigate } from '@shared/lib';

import EmotionDiaryCardContent from './EmotionDiaryCardContent.tsx';
import EmotionDiaryCardHeader from './EmotionDiaryCardHeader.tsx';

interface EmotionDiaryCardListProps {
  data: EmotionDiaryDTO[];
}

const EmotionDiaryCardList = ({ data }: EmotionDiaryCardListProps) => {
  const dispatch = useAppDispatch();

  const handleDiaryDetail = (item: EmotionDiaryDTO) => {
    dispatch(setSelectedDiary(item));
    navigate('EmotionDiaryDetailPage', { origin: 'RootStack' });
  };

  return (
    <>
      <View className="flex-1 justify-start items-stretch w-full mt-[19px]">
        {data?.map((entry, index) => (
          <TouchableOpacity
            onPress={() => {
              handleDiaryDetail(entry);
            }}
            key={index}
          >
            <View
              key={index}
              className="bg-common-white py-5 px-[18px] mb-4 rounded-[15px]"
            >
              <EmotionDiaryCardHeader
                iconId={entry.iconId}
                recordDate={entry.recordDate}
              />
              <EmotionDiaryCardContent content={entry.description ?? ''} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default EmotionDiaryCardList;
