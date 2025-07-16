import { AUTH_PROVIDERS, AuthProvider } from '@entities/auth/types';
import { useSignInAppleMutation, useSignInGoogleMutation } from '@shared/api/auth/authApi';

export function useSocialLogin() {
  const [signInGoogle, { data: googleData, isLoading: isGoogleLoading }] =
    useSignInGoogleMutation();
  const [signInApple, { data: appleData, isLoading: isAppleLoading }] = useSignInAppleMutation();

  const handleLogin = async (provider: AuthProvider) => {
    if (provider === AUTH_PROVIDERS.APPLE) {
      await signInApple();
    } else {
      await signInGoogle();
    }
  };

  return {
    handleLogin,
    isAppleLoading,
    isGoogleLoading,
    isLoading: isAppleLoading || isGoogleLoading,
    data: appleData || googleData,
  };
}
