import { useLazyGetFirstLaunchFlagQuery } from '@entities/auth/api/user-meta.api';
import { isNotEmpty, resetTo, supabase } from '@shared';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const [getFirstLaunchFlag] = useLazyGetFirstLaunchFlagQuery();

  const navigate = useCallback(async () => {
    const response = await getFirstLaunchFlag();
    if (response.data) {
      resetTo('Onboarding');
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (isNotEmpty(user)) {
      resetTo('Main');
    } else {
      resetTo('Login');
    }
  }, [getFirstLaunchFlag]);

  return { navigate };
};
