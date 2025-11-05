import { useEffect } from 'react';

import { useSignOutMutation } from '@/entities/auth/api/auth.api';
import { appApi } from '@/shared/api/AppApi';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { resetTo } from '@/shared/lib/navigation.util';
import { clearUserIdCache } from '@/shared/lib/user.util';
import { isNotEmpty } from '@/shared/lib/value.util';

import { setRequestLogin } from '../../setting/model/settingSlice';

export function useLogout() {
  const [signOut, { data, isLoading }] = useSignOutMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    clearUserIdCache();
    if (isNotEmpty(data) && data) {
      dispatch(appApi.util.resetApiState());
      dispatch(setRequestLogin('FINISH'));
      resetTo('Login');
    }
  }, [isLoading, data, dispatch]);

  return {
    signOut,
  };
}
