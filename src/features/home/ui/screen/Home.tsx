import { Image, StyleSheet, View } from 'react-native';

import { useInitializeDiary } from '@/features/diary/hooks/useInitializeDiary';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize, useAppSelector } from '@/shared/hooks';
import { jumpToTab, navigate } from '@/shared/lib';
import ActionButton from '@/shared/ui/elements/ActionButton';
import DiaryCountCard from '@/shared/ui/elements/DiaryCountCard';
import { H2 } from '@/shared/ui/typography/H2';

const Home = () => {
  useInitializeDiary();
  const isDiaryExist = useAppSelector(state => state.diarySlice.isDiaryExist);

  return (
    <View className="bg-gray-100 flex-1 mx-5 justify-center items-center">
      <DiaryCountCard
        onPress={() => {
          jumpToTab('일기목록');
        }}
      />

      <View className="bg-common-white w-full justify-center items-center rounded-xl px-5 py-6">
        <H2
          weight="semibold"
          style={styles.mentStyle}
        >
          {isDiaryExist.data
            ? '일기를 저장했어요\n오늘 하루도 수고했어요'
            : '오늘 하루 어땠나요\n일기를 작성해볼까요?'}
        </H2>

        <Image
          source={MAIN_ICONS.avatarShadow}
          className="aspect-square"
          style={styles.imageStyle}
        />

        <ActionButton
          onPress={() => navigate('DiaryStack')}
          disabled={isDiaryExist.data}
        >
          {isDiaryExist.data ? '작성 완료' : '작성하러 가기'}
        </ActionButton>
      </View>
    </View>
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

export default Home;
