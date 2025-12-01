import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import { useHasWeeklyReportQuery } from '@/entities/ai-report/api';
import { getWeeklyCycleKey } from '@/shared/lib/day.util';
import { navigate } from '@/shared/lib/navigation.util';

const STORAGE_KEY = 'LAST_SHOWN_WEEKLY_REPORT_KEY';

export const useCheckWeeklyReportModal = () => {
  const { data: hasReport } = useHasWeeklyReportQuery();

  useEffect(() => {
    const checkAndShowModal = async () => {
      if (!hasReport) return;

      try {
        const currentKey = getWeeklyCycleKey();

        const lastKey = await AsyncStorage.getItem(STORAGE_KEY);

        if (lastKey !== currentKey) {
          navigate('ReportResultPage');

          await AsyncStorage.setItem(STORAGE_KEY, currentKey);
        }
      } catch (e) {
        console.error('Failed to check weekly report modal:', e);
      }
    };

    checkAndShowModal();
  }, [hasReport]);
};
