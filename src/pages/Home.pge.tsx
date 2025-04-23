import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image, Text, View } from 'react-native';
import { IMAGES } from '../assets/images';
import ActionButton from '../components/atoms/ActionButton.atm';
import ToolTipView from '../components/atoms/ToolTipView.atm';
import { ICON_DATA } from '../constant/Icons';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '../hooks';
import {
  searchDiaryCountThunk,
  searchDiaryForDayThunk,
  setSelectedDiary,
  setSelectedIcon,
  setTodayDiary,
} from '../redux/slice/diarySlice';
import { isNotEmpty, navigate } from '../utils';

const Home = () => {
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const diaryCount = useAppSelector((state) => state.diarySlice.diaryCount);
  const isDiaryExist = useAppSelector((state) => state.diarySlice.isDiaryExist);

  const initialize = async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(searchDiaryForDayThunk({ realm, recordDate: new Date() }));
      await dispatch(searchDiaryCountThunk({ realm }));
      closeRealm();
    }
  };

  useFocusEffect(
    useCallback(() => {
      // 홈 화면에 진입할 때마다 기존에 선택된 일기 정보 초기화
      dispatch(setSelectedIcon(ICON_DATA[0]));
      dispatch(setSelectedDiary({}));
      dispatch(setTodayDiary(null));
      initialize();
    }, [dispatch])
  );

  return (
    <>
      <View className="bg-white flex-1 first:justify-center items-center">
        <ToolTipView
          style={{ marginBottom: getScaleSize(78) }}
          text={
            isDiaryExist.data
              ? '일기를 소중히 저장했어!'
              : '오늘 하루 어땠어? 이야기를 들려줘!'
          }
        />
        <Image
          source={IMAGES.smile}
          className="aspect-square w-2/3"
        />

        <Text
          className="font-pretendard font-bold text-center tracking-[-0.5px]"
          style={{ marginTop: getScaleSize(17), fontSize: getScaleSize(18) }}
        >
          일기 작성 수
        </Text>
        <Text
          className="font-pretendard font-bold text-center tracking-[-0.5px]"
          style={{ marginTop: getScaleSize(11), fontSize: getScaleSize(39) }}
        >
          {diaryCount.data}
        </Text>

        <View
          className="w-full"
          style={{ marginTop: getScaleSize(66) }}
        >
          <ActionButton
            onPress={() => {
              navigate('DiaryStack');
            }}
            disabled={isDiaryExist.data}
          >
            {isDiaryExist.data ? '일기 작성 완료' : '들려주러 가기'}
          </ActionButton>
        </View>
      </View>
    </>
  );
};

export default Home;
