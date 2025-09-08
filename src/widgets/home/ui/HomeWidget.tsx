import {
  useDeletePushTokenMutation,
  useUpsertPushTokenMutation,
} from '@entities/auth/api/auth.api';
import { useGetDiaryCountQuery, useHasDiaryForDayQuery } from '@entities/diary/api/diary.api';
import { resetDiary } from '@features/diary';
import { usePushNavigation } from '@features/diary/hooks/usePushNavigation';
import { useFocusEffect } from '@react-navigation/native';
import { jumpToTab, navigate, useAppDispatch, useDelay, useNotificationPermission } from '@shared';
import { useCallback, useEffect, useState } from 'react';

import HomeContent from './HomeContent';
import HomeLoading from './HomeLoading';

const HomeWidget = () => {
  const dispatch = useAppDispatch();
  const { data: hasDiary, isLoading: isHasDiaryLoading } = useHasDiaryForDayQuery(undefined, {
    pollingInterval: 300000,
  });
  const { data: diaryCount, isLoading: isDiaryCountLoading } = useGetDiaryCountQuery();
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
