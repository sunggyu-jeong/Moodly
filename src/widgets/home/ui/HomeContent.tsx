import { ActionButton, DiaryCountCard, getScaleSize, gray, H2 } from '@/shared';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { Image, StyleSheet, View } from 'react-native';

interface HomeContentProps {
  diaryCount: number;
  hasDiary: boolean;
  onNavigateToDiaryList: () => void;
  onNavigateToEmotionSelection: () => void;
}

const HomeContent = ({
  diaryCount,
  hasDiary,
  onNavigateToDiaryList,
  onNavigateToEmotionSelection,
}: HomeContentProps) => {
  const titleText = hasDiary
    ? '일기를 저장했어요\n오늘 하루도 수고했어요'
    : '오늘 하루 어땠나요\n일기를 작성해볼까요?';

  const buttonText = hasDiary ? '작성 완료' : '작성하러 가기';

  return (
    <>
      <DiaryCountCard
        count={diaryCount}
        onPress={onNavigateToDiaryList}
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
          onPress={onNavigateToEmotionSelection}
          disabled={hasDiary}
        >
          {buttonText}
        </ActionButton>
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
    color: gray[600],
  },
});

export default HomeContent;
