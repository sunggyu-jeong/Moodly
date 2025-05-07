import { TouchableOpacity, View } from 'react-native';

import { EmotionDiaryDTO } from '@/entities/diary';
import { setSelectedDiary } from '@/features/diary/model/diary.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { isNotEmpty, navigate } from '@/shared/lib';

import DiaryCardContent from './DiaryCardContent';
import DiaryCardHeader from './DiaryCardHeader';

const DiaryCardList = () => {
  const dispatch = useAppDispatch();
  const searchByMonth = useAppSelector(state => state.diarySlice.searchByMonth);

  const handleDiaryDetail = (item: EmotionDiaryDTO) => {
    dispatch(setSelectedDiary(item));
    navigate('DiaryDetail', { origin: 'RootStack' });
  };

  return (
    <>
      <View className="flex-1 justify-start items-stretch w-full mt-[19px]">
        {searchByMonth?.data?.map((entry, index) => (
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
              {isNotEmpty(searchByMonth?.data) && (
                <DiaryCardHeader
                  iconId={entry.iconId}
                  recordDate={entry.recordDate}
                />
              )}
              <DiaryCardContent content={entry.description ?? ''} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default DiaryCardList;
