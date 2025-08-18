import { baseApi, useAppDispatch, useSignInAppleMutation, useSignInGoogleMutation } from "@/shared";
import { AUTH_PROVIDERS, type AuthProvider } from "@entities/auth";
import { setRequestLogin } from "../../setting/model/settingSlice";


export function useSocialLogin() {
  const [signInGoogle, { data: googleData, isLoading: isGoogleLoading }] =
    useSignInGoogleMutation();
  const [signInApple, { data: appleData, isLoading: isAppleLoading }] = useSignInAppleMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (provider: AuthProvider) => {
    dispatch(setRequestLogin('REQUEST'));
    if (provider === AUTH_PROVIDERS.APPLE) {
      await signInApple();
    } else {
      await signInGoogle();
    }
    dispatch(baseApi.util.invalidateTags(['EmotionDiary']));
    dispatch(baseApi.util.invalidateTags(['Auth']));
  };

  return {
    handleLogin,
    isAppleLoading,
    isGoogleLoading,
    isLoading: isAppleLoading || isGoogleLoading,
    data: appleData || googleData,
  };
}
