import {
  useDeletePushTokenMutation,
  useUpsertPushTokenMutation,
} from '@/entities/auth/api/auth.api';
import { useGetDiaryCountQuery, useHasDiaryForDayQuery } from '@/entities/diary/api/diary.api';
import { usePushNavigation } from '@/features/diary/hooks/usePushNavigation';
import { resetDiary } from '@/features/diary/model/diarySlice';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import useDelay from '@/shared/hooks/useDelay';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import { getScaleSize } from '@/shared/hooks/useScale';
import { navigate } from '@/shared/lib/navigation.util';
import { gray } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import DiaryCountCard from '@/shared/ui/elements/DiaryCountCard';
import HomeLoading from '@/shared/ui/elements/HomeLoading';
import { H2 } from '@/shared/ui/typography/H2';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const POLLING_INTERVAL = 300000;

const TEXTS = {
  HAS_DIARY: '일기를 저장했어요\n오늘 하루도 수고했어요',
  NO_DIARY: '오늘 하루 어땠나요\n일기를 작성해볼까요?',
  BUTTON_COMPLETE: '작성 완료',
  BUTTON_WRITE: '작성하러 가기',
} as const;

// ============================================================
// Component
// ============================================================
const HomePage = () => {
  const dispatch = useAppDispatch();

  const { data: hasDiary, isLoading: isHasDiaryLoading } = useHasDiaryForDayQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
  });
  const { data: diaryCount, isLoading: isDiaryCountLoading } = useGetDiaryCountQuery();

  // Mutations
  const [upsertToken] = useUpsertPushTokenMutation();
  const [deleteToken] = useDeletePushTokenMutation();

  // Local state
  const [permissionRequested, setPermissionRequested] = useState(false);

  const titleText = hasDiary ? TEXTS.HAS_DIARY : TEXTS.NO_DIARY;
  const buttonText = hasDiary ? TEXTS.BUTTON_COMPLETE : TEXTS.BUTTON_WRITE;
  const isLoading = isHasDiaryLoading || isDiaryCountLoading;

  const handleTokenUpdate = useCallback(
    async (token: string | null) => {
      if (permissionRequested) {
        return;
      }

      try {
        if (token) {
          await upsertToken({ token }).unwrap();
        } else {
          await deleteToken().unwrap();
        }
      } catch (error) {
        console.error('푸시 토큰 업데이트 실패:', error);
      } finally {
        setPermissionRequested(true);
      }
    },
    [upsertToken, deleteToken, permissionRequested],
  );

  const onNavigateToDiaryList = useCallback(() => {
    navigate('Main', {
      screen: 'DiaryList',
    });
  }, []);

  const onNavigateToEmotionSelection = useCallback(() => {
    navigate('DiaryStack', {
      screen: 'EmotionSelectionPage',
    });
  }, []);

  const { requestUserPermission } = useNotificationPermission({
    onTokenUpdate: handleTokenUpdate,
  });

  usePushNavigation({ hasDiary });

  useEffect(() => {
    requestUserPermission();
  }, [requestUserPermission]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetDiary());
    }, [dispatch]),
  );

  if (useDelay(isLoading)) {
    return <HomeLoading />;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />

      <DiaryCountCard
        count={diaryCount ?? 0}
        onPress={onNavigateToDiaryList}
      />

      <View style={styles.contentCard}>
        <H2
          weight="semibold"
          style={styles.titleText}
        >
          {titleText}
        </H2>

        <Image
          source={MAIN_ICONS.avatarShadow}
          style={styles.avatarImage}
          resizeMode="contain"
        />

        <ActionButton
          onPress={onNavigateToEmotionSelection}
          disabled={hasDiary}
        >
          {buttonText}
        </ActionButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: gray[100],
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  avatarImage: {
    height: getScaleSize(138),
    width: getScaleSize(138),
    marginTop: getScaleSize(30),
    marginBottom: getScaleSize(30),
    aspectRatio: 1,
  },
  titleText: {
    marginTop: getScaleSize(36),
    color: gray[600],
    textAlign: 'center',
  },
});

export default HomePage;
