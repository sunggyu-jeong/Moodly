import { useSignInWithProviderMutation } from '@/entities/auth/api/auth.api';
import { AuthProvider } from '@/entities/auth/types';
import { setRequestLogin } from '@/features/setting/model/settingSlice';
import { useAppDispatch } from '@/shared/hooks/useHooks';

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
