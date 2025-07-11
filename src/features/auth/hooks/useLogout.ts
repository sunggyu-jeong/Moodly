import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { useSignOutMutation } from '@shared/api/auth/authApi';
import { ApiCode } from '@shared/config/errorCodes';
import { useAppDispatch } from '@shared/hooks';
import { isNotEmpty, resetTo } from '@shared/lib';
import { useEffect } from 'react';

export function useLogout() {
  const [signOut, { data, isLoading }] = useSignOutMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) return;

    if (isNotEmpty(data) && data === ApiCode.SUCCESS) {
      dispatch(
        setShowToastView({
          visibility: true,
          message: '로그아웃 요청이 완료되었습니다.',
        })
      );
      resetTo('Login');
    }
  }, [isLoading, data, dispatch]);

  return {
    signOut,
  };
}
