import { useGetDiaryCountQuery, useHasDiaryForDayQuery } from '@entities/diary/api/diary.api';
import { resetDiary } from '@features/diary';
import { useFocusEffect } from '@react-navigation/native';
import { jumpToTab, navigate, useAppDispatch, useDelay, useNotificationPermission } from '@shared';
import { useCallback, useEffect } from 'react';

import HomeContent from './HomeContent';
import HomeLoading from './HomeLoading';

const HomeWidget = () => {
  const dispatch = useAppDispatch();
  const { data: hasDiary, isLoading: isHasDiaryLoading } = useHasDiaryForDayQuery();
  const { data: diaryCount, isLoading: isDiaryCountLoading } = useGetDiaryCountQuery();
  const { requestNotification } = useNotificationPermission();

  const isLoading = isHasDiaryLoading || isDiaryCountLoading;

  useEffect(() => {
    requestNotification();
  }, [requestNotification]);

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
