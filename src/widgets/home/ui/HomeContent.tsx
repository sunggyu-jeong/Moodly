import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks/useScale';
import { gray } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import DiaryCountCard from '@/shared/ui/elements/DiaryCountCard';
import { H2 } from '@/shared/ui/typography/H2';
import { View, Image, StyleSheet } from 'react-native';

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
      <View style={styles.container}>
        <H2
          weight="semibold"
          style={styles.mentStyle}
        >
          {titleText}
        </H2>
        <Image
          source={MAIN_ICONS.avatarShadow}
          style={styles.imageStyle}
          resizeMode="contain"
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
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  imageStyle: {
    height: getScaleSize(138),
    width: getScaleSize(138),
    marginTop: getScaleSize(30),
    marginBottom: getScaleSize(30),
    aspectRatio: 1,
  },
  mentStyle: {
    marginTop: getScaleSize(36),
    color: gray[600],
  },
});

export default HomeContent;
