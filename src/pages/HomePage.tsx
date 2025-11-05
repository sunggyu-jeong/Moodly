import {
  useUpsertPushTokenMutation,
  useDeletePushTokenMutation,
} from '@/entities/auth/api/auth.api';
import { useHasDiaryForDayQuery, useGetDiaryCountQuery } from '@/entities/diary/api/diary.api';
import { usePushNavigation } from '@/features/diary/hooks/usePushNavigation';
import { resetDiary } from '@/features/diary/model/diarySlice';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import useDelay from '@/shared/hooks/useDelay';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import { getScaleSize } from '@/shared/hooks/useScale';
import { jumpToTab, navigate } from '@/shared/lib/navigation.util';
import { gray } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import DiaryCountCard from '@/shared/ui/elements/DiaryCountCard';
import { H2 } from '@/shared/ui/typography/H2';
import HomeContent from '@/widgets/home/ui/HomeContent';
import HomeLoading from '@/shared/ui/elements/HomeLoading';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Image } from 'react-native';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { data: hasDiary, isLoading: isHasDiaryLoading } = useHasDiaryForDayQuery(undefined, {
    pollingInterval: 300000,
  });
  const { data: diaryCount, isLoading: isDiaryCountLoading } = useGetDiaryCountQuery();
  const [permissionRequested, setPermissionRequested] = useState(false);

  const titleText = hasDiary
    ? '일기를 저장했어요\n오늘 하루도 수고했어요'
    : '오늘 하루 어땠나요\n일기를 작성해볼까요?';

  const buttonText = hasDiary ? '작성 완료' : '작성하러 가기';
  const isLoading = isHasDiaryLoading || isDiaryCountLoading;

  const [upsertToken] = useUpsertPushTokenMutation();
  const [deleteToken] = useDeletePushTokenMutation();

  const handleTokenUpdate = useCallback(
    async (token: string | null) => {
      if (permissionRequested) return;
      try {
        if (token) {
          await upsertToken({ token }).unwrap();
        } else {
          await deleteToken().unwrap();
        }
      } catch (error) {
        console.log('>>>>>>>>>>>>>>>>>>>>', error);
      } finally {
        setPermissionRequested(() => true);
      }
    },
    [upsertToken, deleteToken, permissionRequested],
  );

  const { requestUserPermission } = useNotificationPermission({
    onTokenUpdate: handleTokenUpdate,
  });

  useEffect(() => {
    requestUserPermission();
    setPermissionRequested(true);
  }, [requestUserPermission]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetDiary());
    }, [dispatch]),
  );

  usePushNavigation({ hasDiary });

  if (useDelay(isLoading)) {
    return <HomeLoading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[100],
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default HomePage;
