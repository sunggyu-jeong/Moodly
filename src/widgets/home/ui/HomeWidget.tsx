import {
  useDeletePushTokenMutation,
  useFetchSessionQuery,
  useUpsertPushTokenMutation,
} from '@entities/auth/api/auth.api';
import { useGetDiaryCountQuery, useHasDiaryForDayQuery } from '@entities/diary/api/diary.api';
import { resetDiary } from '@features/diary';
import { useFocusEffect } from '@react-navigation/native';
import { jumpToTab, navigate, useAppDispatch, useDelay, useNotificationPermission } from '@shared';
import { useCallback, useEffect, useState } from 'react';

import HomeContent from './HomeContent';
import HomeLoading from './HomeLoading';

const HomeWidget = () => {
  const dispatch = useAppDispatch();
  const { data: hasDiary, isLoading: isHasDiaryLoading } = useHasDiaryForDayQuery();
  const { data: diaryCount, isLoading: isDiaryCountLoading } = useGetDiaryCountQuery();
  const { data: session, isLoading: isSessionLoading } = useFetchSessionQuery();
  const [permissionRequested, setPermissionRequested] = useState(false);

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

  const { status, requestUserPermission } = useNotificationPermission({
    onTokenUpdate: handleTokenUpdate,
  });

  useEffect(() => {
    if (session && !isSessionLoading && status === 'denied' && !permissionRequested) {
      requestUserPermission();
      setPermissionRequested(true);
    }
  }, [session, isSessionLoading, status, permissionRequested, requestUserPermission]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetDiary());
    }, [dispatch]),
  );

  if (useDelay(isLoading)) {
    return <HomeLoading />;
  }

  return (
    <HomeContent
      diaryCount={diaryCount ?? 0}
      hasDiary={hasDiary ?? false}
      onNavigateToDiaryList={() => jumpToTab('DiaryList')}
      onNavigateToEmotionSelection={() =>
        navigate('DiaryStack', { screen: 'EmotionSelectionPage' })
      }
    />
  );
};

export default HomeWidget;
