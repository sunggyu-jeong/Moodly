import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image, Text, View } from 'react-native';

import {
  searchDiaryCountThunk,
  searchDiaryForDayThunk,
  setSelectedDiary,
  setSelectedIcon,
  setTodayDiary,
} from '@/features/diary/model/diary.slice';
import { IMAGES } from '@/shared/assets/images';
import { ICON_DATA } from '@/shared/constants/Icons';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '@/shared/hooks';
import { isNotEmpty, navigate } from '@/shared/lib';
import ActionButton from '@/shared/ui/elements/ActionButton';
import ToolTipView from '@/shared/ui/elements/ToolTipView';

const Home = () => {
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const diaryCount = useAppSelector((state) => state.diarySlice.diaryCount);
  const isDiaryExist = useAppSelector((state) => state.diarySlice.isDiaryExist);

  const initialize = useCallback(async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(searchDiaryForDayThunk({ realm, recordDate: new Date() }));
      await dispatch(searchDiaryCountThunk({ realm }));
      closeRealm();
    }
  }, [openRealm, dispatch, closeRealm]);

  useFocusEffect(
    useCallback(() => {
      // 홈 화면에 진입할 때마다 기존에 선택된 일기 정보 초기화
      dispatch(setSelectedIcon(ICON_DATA[0]));
      dispatch(setSelectedDiary({}));
      dispatch(setTodayDiary(null));
      initialize();
    }, [dispatch, initialize])
  );

  return (
    <>
      <View className="bg-white flex-1">
        <View
          className="flex-1 justify-center items-center"
          style={{ marginTop: getScaleSize(100) }}
        >
          <ToolTipView
            style={{ marginBottom: getScaleSize(38) }}
            text={
              isDiaryExist.data
                ? '일기를 소중히 저장했어!'
                : '오늘 하루 어땠어? 이야기를 들려줘!'
            }
          />
          <Image
            source={IMAGES.smile}
            className="aspect-square"
            style={{ width: getScaleSize(160), height: getScaleSize(160) }}
          />
        </View>
        <Text
          className="font-pretendard font-semibold text-center tracking-[-0.5px]"
          style={{ marginBottom: getScaleSize(6), fontSize: getScaleSize(14) }}
        >
          일기 작성 수
        </Text>
        <Text
          className="font-pretendard font-semibold text-center tracking-[-0.5px]"
          style={{ marginBottom: getScaleSize(45), fontSize: getScaleSize(28) }}
        >
          {diaryCount.data}
        </Text>
        <View
          className="w-full"
          style={{ marginBottom: getScaleSize(44) }}
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
