import * as amplitude from '@amplitude/analytics-react-native';
import type { AuthProvider } from '@entities/auth';
import { useSignInWithProviderMutation } from '@entities/auth/api/auth.api';
import { useAppDispatch } from '@shared';
import { useEffect } from 'react';

import { setRequestLogin } from '../../setting';

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
      });
    }
  }, [data]);

  return {
    handleLogin,
    isLoading,
    data,
  };
}
