import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { useHasWeeklyReportQuery } from '@/entities/ai-report/api';
import { useGetUserDiaryCountQuery } from '@/entities/diary/api';
import { getWeeklyCycleKey } from '@/shared/lib/day.util';

const STORAGE_KEY = 'LAST_CHECKED_WEEKLY_REPORT_KEY';

export const useWeeklyReportCheck = () => {
  const [localCheckDone, setLocalCheckDone] = useState(false);
  const [shouldCheckServer, setShouldCheckServer] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const lastKey = await AsyncStorage.getItem(STORAGE_KEY);
        const currentKey = getWeeklyCycleKey();

        if (lastKey !== currentKey) {
          setShouldCheckServer(true);
        }
      } catch (e: any) {
        console.log('>>>>>>>>>', e);
        setShouldCheckServer(true);
      } finally {
        setLocalCheckDone(true);
      }
    };
    checkStorage();
  }, []);

  const { data: diaryCount = 0 } = useGetUserDiaryCountQuery(undefined, {
    skip: !localCheckDone || !shouldCheckServer,
  });

  const isNewUser = diaryCount === 0;

  const { data: hasReport = false, isSuccess: isReportCheckSuccess } = useHasWeeklyReportQuery(
    undefined,
    {
      skip: !localCheckDone || !shouldCheckServer || isNewUser,
    },
  );

  useEffect(() => {
    if (isReportCheckSuccess && hasReport) {
      const saveHistory = async () => {
        const currentKey = getWeeklyCycleKey();
        await AsyncStorage.setItem(STORAGE_KEY, currentKey);
      };
      saveHistory();
    }
  }, [isReportCheckSuccess, hasReport]);

  return {
    hasReport,
    isBlocked: !shouldCheckServer || isNewUser,
  };
};
