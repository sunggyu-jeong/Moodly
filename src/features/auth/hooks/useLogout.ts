import { useSignOutMutation } from '@entities/auth/api/auth.api';
import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import { appApi } from '@shared/api/AppApi';
import { useAppDispatch } from '@shared/hooks';
import { isNotEmpty, resetTo } from '@shared/lib';
import { clearUserIdCache } from '@shared/lib/user.util';
import { useEffect } from 'react';

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
      dispatch(
        setShowToastView({
          visibility: true,
          message: '로그아웃 요청이 완료되었습니다.',
        }),
      );
      resetTo('Login');
    }
  }, [isLoading, data, dispatch]);

  return {
    signOut,
  };
}
