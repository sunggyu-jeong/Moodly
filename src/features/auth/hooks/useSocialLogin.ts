import type { AuthProvider } from '@entities/auth';
import { useSignInWithProviderMutation } from '@entities/auth/api/auth.api';
import { useAppDispatch } from '@shared';

import { setRequestLogin } from '../../setting';

export function useSocialLogin() {
  const [signInWithProvider, { data, isLoading }] = useSignInWithProviderMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (provider: AuthProvider) => {
    dispatch(setRequestLogin('REQUEST'));
    await signInWithProvider({ provider });
  };

  return {
    handleLogin,
    isLoading,
    data,
  };
}
