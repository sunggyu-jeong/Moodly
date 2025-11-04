import { setModifyMode } from '@/features/diary/model/diarySlice';

import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/useHooks';
import { getScaleSize } from '@/shared/hooks/useScale';
import { dismissModalToScreen, navigate } from '@/shared/lib/navigation.util';
import { common, gray } from '@/shared/styles/colors';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const EmotionDiaryCompletePage = () => {
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const dispatch = useAppDispatch();

  const handleScreenFocus = React.useCallback(() => {
    const timer = setTimeout(() => {
      if (isModifyMode) {
        dismissModalToScreen();
        dispatch(setModifyMode(false));
      } else {
        navigate('DiaryStack', {
          screen: 'EmotionDetailPage',
          params: { origin: 'DiaryStack' },
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [dispatch, isModifyMode]);

  useFocusEffect(handleScreenFocus);

  return (
    <View style={styles.container}>
      <Image
        source={MAIN_ICONS.avatarComplete}
        style={styles.avatar}
      />
      <H2
        weight="semibold"
        style={styles.title}
      >
        일기 작성 완료
      </H2>
      <Body2
        weight="regular"
        style={styles.subtitle}
      >
        솔직한 마음을 들려줘서 고마워요
      </Body2>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: getScaleSize(120),
    height: getScaleSize(120),
  },
  title: {
    color: gray[600],
    marginTop: getScaleSize(8),
  },
  subtitle: {
    color: gray[400],
    marginTop: getScaleSize(8),
  },
});

export default EmotionDiaryCompletePage;
