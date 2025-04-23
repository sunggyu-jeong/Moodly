import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector, useRealm, useScale } from '../../hooks';
import { searchDiaryByMonthThunk, setSelectedDiary } from '../../redux/slice/diarySlice';
import { EmotionDiaryDTO } from '../../scheme';
import { isEmpty, isNotEmpty, navigate } from '../../utils';
import DiaryCardContent from '../atoms/DiaryCardContent.atm';
import DiaryCardHeader from '../molecules/DiaryCardHeader.mol';

const DiaryCardList = () => {
  const { openRealm, closeRealm } = useRealm();
  const dispatch = useAppDispatch();
  const selectedMonth = useAppSelector((state) => state.diarySlice.selectedMonth);
  const searchByMonth = useAppSelector((state) => state.diarySlice.searchByMonth);
  const { getScaleSize } = useScale();

  useFocusEffect(
    useCallback(() => {
      initialize();
    }, [selectedMonth])
  );

  const initialize = async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(
        searchDiaryByMonthThunk({ realm, recordDate: new Date(selectedMonth) })
      );
      closeRealm();
    }
  };

  const handleDiaryDetail = (item: EmotionDiaryDTO) => {
    dispatch(setSelectedDiary(item));
    navigate('DiaryDetail', { origin: 'RootStack' });
  };

  return (
    <>
      {isNotEmpty(searchByMonth?.data) && (
        <View className="flex-1 justify-start items-stretch w-full">
          {searchByMonth?.data?.map((entry, index) => (
            <TouchableOpacity
              onPress={() => {
                handleDiaryDetail(entry);
              }}
              key={index}
            >
              <View
                key={index}
                className="bg-[#F0F0F0] p-4 mb-4 rounded-[9px]"
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
      )}
      {isEmpty(searchByMonth.data) && (
        <View className="w-full min-h-[70vh] justify-center items-center">
          <Text
            className="font-pretendard tracking-[-0.5px]"
            style={{ fontSize: getScaleSize(14) }}
          >
            작성한 일기가 없어요!
          </Text>
        </View>
      )}
    </>
  );
};

export default DiaryCardList;
