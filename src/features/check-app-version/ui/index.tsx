import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

import type { VersionPolicy } from '@/entities/app/model/types';
import { versionToNumber } from '@/shared/lib/number.util';

import { useGetAppVersionPolicyQuery } from '../api/version.api';

type VersionStatus = 'latest' | 'recommended' | 'required';

interface UseVersionCheckResult {
  isLoading: boolean;
  versionStatus: VersionStatus;
  versionPolicy: VersionPolicy | null;
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const { data: versionPolicy, isLoading, isSuccess } = useGetAppVersionPolicyQuery();
  const [versionStatus, setVersionStatus] = useState<VersionStatus>('latest');

  useEffect(() => {
    if (isSuccess && versionPolicy) {
      const { minimum_version, latest_version } = versionPolicy;
      const currentVersion = Constants.expoConfig?.version ?? '1.0.0';

      const currentVersionNum = versionToNumber(currentVersion);
      const minimumVersionNum = versionToNumber(minimum_version);
      const latestVersionNum = versionToNumber(latest_version);

      Promise.resolve().then(() => {
        if (currentVersionNum < minimumVersionNum) {
          setVersionStatus('required');
        } else if (currentVersionNum < latestVersionNum) {
          setVersionStatus('recommended');
        } else {
          setVersionStatus('latest');
        }
      });
    }
  }, [versionPolicy, isSuccess]);

  return { isLoading, versionStatus, versionPolicy: versionPolicy || null };
};
