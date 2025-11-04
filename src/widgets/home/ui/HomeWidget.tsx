import {
  useUpsertPushTokenMutation,
  useDeletePushTokenMutation,
} from '@/entities/auth/api/auth.api';
import { useHasDiaryForDayQuery, useGetDiaryCountQuery } from '@/entities/diary/api/diary.api';
import { usePushNavigation } from '@/features/diary/hooks/usePushNavigation';
import { resetDiary } from '@/features/diary/model/diarySlice';
import useDelay from '@/shared/hooks/useDelay';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import { jumpToTab, navigate } from '@/shared/lib/navigation.util';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';
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
