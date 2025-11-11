import * as Application from 'expo-application';
import { useMemo } from 'react';

import type { VersionPolicy } from '@/entities/app/model/types';
import { versionToNumber } from '@/shared/lib/number.util';
import { useGetAppVersionPolicyQuery } from '@/entities/check-app-version/api';

type VersionStatus = 'latest' | 'recommended' | 'required';

interface UseVersionCheckResult {
  isLoading: boolean;
  versionStatus: VersionStatus;
  versionPolicy: VersionPolicy | null;
}

function getCurrentVersion(): string {
  return Application.nativeApplicationVersion ?? '1.0.0';
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const { data: versionPolicy, isLoading, isSuccess } = useGetAppVersionPolicyQuery();

  const versionStatus: VersionStatus = useMemo(() => {
    const currentVersion = getCurrentVersion();

    if (!isSuccess || !versionPolicy) return 'latest';

    const cur = versionToNumber(currentVersion);
    const min = versionToNumber(versionPolicy.minimum_version);
    const latest = versionToNumber(versionPolicy.latest_version);

    if (cur < min) return 'required';
    if (cur < latest) return 'recommended';
    return 'latest';
  }, [isSuccess, versionPolicy]);

  return { isLoading, versionStatus, versionPolicy: versionPolicy ?? null };
};
