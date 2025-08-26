import { setModifyMode } from '@features/diary/model/diarySlice';
import { useFocusEffect } from '@react-navigation/native';
import {
  Body2,
  dismissModalToScreen,
  getScaleSize,
  gray,
  H2,
  navigate,
  useAppDispatch,
  useAppSelector,
} from '@shared';
import { MAIN_ICONS } from '@shared/assets/images/main';
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
        navigate('DiaryStack', { screen: 'EmotionDetailPage', params: { origin: 'DiaryStack' } });
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, isModifyMode]);

  useFocusEffect(handleScreenFocus);

  return (
    <View className="flex-1 bg-common-white items-center justify-center">
      <Image
        source={MAIN_ICONS.avatarComplete}
        style={styles.avatarStyle}
      />
      <H2
        weight="semibold"
        style={styles.mentStyle}
      >
        일기 작성 완료
      </H2>
      <Body2
        weight="regular"
        style={styles.bodyStyle}
      >
        솔직한 마음을 들려줘서 고마워요
      </Body2>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarStyle: {
    height: getScaleSize(120),
    width: getScaleSize(120),
  },
  bodyStyle: {
    color: gray[400],
    marginTop: getScaleSize(8),
  },
  mentStyle: {
    color: gray[600],
    marginTop: getScaleSize(8),
  },
});

export default EmotionDiaryCompletePage;
