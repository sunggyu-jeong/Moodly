import { resetDiary } from '@features/diary/model/diary.slice';
import { useFocusEffect } from '@react-navigation/native';
import { useGetDiaryCountQuery, useHasDiaryForDayQuery } from '@shared/api/diary/diaryApi';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { getScaleSize, useAppDispatch } from '@shared/hooks';
import { jumpToTab, navigate } from '@shared/lib';
import ActionButton from '@shared/ui/elements/ActionButton.tsx';
import DiaryCountCard from '@shared/ui/elements/DiaryCountCard.tsx';
import { H2 } from '@shared/ui/typography/H2.tsx';
import { useCallback } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { data: hasDiary } = useHasDiaryForDayQuery();
  const { data: diaryCount } = useGetDiaryCountQuery();

  useFocusEffect(
    useCallback(() => {
      dispatch(resetDiary());
    }, [dispatch]),
  );

  const titleText = hasDiary
    ? '일기를 저장했어요\n오늘 하루도 수고했어요'
    : '오늘 하루 어땠나요\n일기를 작성해볼까요?';

  const buttonText = hasDiary ? '작성 완료' : '작성하러 가기';

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
      />
      <View className="bg-gray-100 flex-1 px-5 justify-center items-center">
        <DiaryCountCard
          count={diaryCount ?? 0}
          onPress={() => {
            jumpToTab('DiaryList');
          }}
        />

        <View className="bg-common-white w-full justify-center items-center rounded-xl px-5 py-6">
          <H2
            weight="semibold"
            style={styles.mentStyle}
          >
            {titleText}
          </H2>

          <Image
            source={MAIN_ICONS.avatarShadow}
            className="aspect-square"
            style={styles.imageStyle}
          />

          <ActionButton
            onPress={() => navigate('DiaryStack', { screen: 'EmotionSelectionPage' })}
            disabled={hasDiary ?? false}
          >
            {buttonText}
          </ActionButton>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: getScaleSize(138),
    marginBottom: getScaleSize(30),
    marginTop: getScaleSize(30),
    width: getScaleSize(138),
  },
  mentStyle: {
    marginTop: getScaleSize(36),
  },
});

export default HomePage;
