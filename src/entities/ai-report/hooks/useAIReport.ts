import { useEffect, useState } from 'react';

import { fetchAIReportMock } from '@/entities/ai-report/api';
import type { AIReport } from '@/entities/ai-report/model/types';

export const useAIReport = (dateISO: string) => {
  const [data, setData] = useState<AIReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const requestAPI = async () => {
      try {
        const response = await fetchAIReportMock(dateISO);
        if (mounted) {
          setData(response);
        }
      } catch (error) {
        if (mounted) {
          setError(error);
        }
        console.log('error', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    requestAPI();
    return () => {
      mounted = false;
    };
  }, [dateISO]);

  return { data, isLoading, error };
};
