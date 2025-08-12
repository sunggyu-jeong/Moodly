import { AUTH_PROVIDERS, AuthProvider } from '@entities/auth/types';
import { useSignInAppleMutation, useSignInGoogleMutation } from '@shared/api/auth/authApi';
import { baseApi } from '@shared/api/base';
import { useAppDispatch } from '@shared/hooks';

import { useDiaryMigration } from '../../diary/hooks/useDiaryMigration';
import { setRequestLogin } from '../../setting/model/setting.slice';

export function useSocialLogin() {
  const [signInGoogle, { data: googleData, isLoading: isGoogleLoading }] =
    useSignInGoogleMutation();
  const [signInApple, { data: appleData, isLoading: isAppleLoading }] = useSignInAppleMutation();
  const dispatch = useAppDispatch();
  const { migrate } = useDiaryMigration();

  const handleLogin = async (provider: AuthProvider) => {
    dispatch(setRequestLogin('REQUEST'));
    if (provider === AUTH_PROVIDERS.APPLE) {
      await signInApple();
    } else {
      await signInGoogle();
    }
    dispatch(baseApi.util.invalidateTags(['EmotionDiary']));
    dispatch(baseApi.util.invalidateTags(['Auth']));
    await migrate();
  };

  return {
    handleLogin,
    isAppleLoading,
    isGoogleLoading,
    isLoading: isAppleLoading || isGoogleLoading,
    data: appleData || googleData,
  };
}
