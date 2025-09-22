import type { VersionPolicy } from '@entities/app/model/types';
import { versionToNumber } from '@shared';
import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';

import { useGetAppVersionPolicyQuery } from '../api/version.api';

type VersionStatus = 'latest' | 'recommended' | 'required' | null;

interface UseVersionCheckResult {
  isLoading: boolean;
  versionStatus: VersionStatus;
  versionPolicy: VersionPolicy | null;
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const { data: versionPolicy, isLoading, isSuccess } = useGetAppVersionPolicyQuery();
  const [versionStatus, setVersionStatus] = useState<VersionStatus>(null);

  useEffect(() => {
    if (isLoading) return;
    if (isSuccess && versionPolicy) {
      const { minimum_version, latest_version } = versionPolicy;

      const currentVersion = DeviceInfo.getVersion();

      const currentVersionNum = versionToNumber(currentVersion);
      const minimumVersionNum = versionToNumber(minimum_version);
      const latestVersionNum = versionToNumber(latest_version);

      if (currentVersionNum < minimumVersionNum) {
        setVersionStatus('required');
      } else if (currentVersionNum < latestVersionNum) {
        setVersionStatus('recommended');
      } else {
        setVersionStatus('latest');
      }
    } else {
      // 서버오류로 조회 실패 시 최신버전으로 간주
      setVersionStatus('latest');
    }
  }, [versionPolicy, isSuccess]);

  return { isLoading, versionStatus, versionPolicy: versionPolicy || null };
};
