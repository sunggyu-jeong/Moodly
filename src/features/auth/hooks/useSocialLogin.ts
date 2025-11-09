import * as amplitude from '@amplitude/analytics-react-native';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useSignInWithProviderMutation } from '@/entities/auth/api/auth.api';
import type { AuthProvider } from '@/entities/auth/model/auth.types';
import { setRequestLogin } from '@/features/setting/model/settingSlice';
import { useAppDispatch } from '@/shared/hooks/useHooks';

export function useSocialLogin() {
  const [signInWithProvider, { data, isLoading }] = useSignInWithProviderMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (provider: AuthProvider) => {
    dispatch(setRequestLogin('REQUEST'));
    await signInWithProvider({ provider });
  };

  useEffect(() => {
    if (data?.isNewUser) {
      amplitude.track('Diary_Entry_Completed', {
        provider: data.provider,
        userId: data.user?.id,
        platform: Platform.OS,
      });
    }
  }, [data]);

  return {
    handleLogin,
    isLoading,
    data,
  };
}
