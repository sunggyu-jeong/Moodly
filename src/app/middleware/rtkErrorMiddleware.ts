import { isRejectedWithValue } from '@reduxjs/toolkit';

import store from '@/app/store';
import { AppError } from '@/shared/api/error/appError';
import { setShowToastView } from '@/shared/model/overlaySlice';

export const rtkErrorMiddleware = () => (next: (action: any) => any) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const err = action.payload as AppError | undefined;
    const silent = action.meta.arg.extraOption.silentError as boolean | undefined;

    if (err && !silent) {
      const msg =
        err.code === 'UNAUTHORIZED'
          ? '로그인이 만료되었습니다.'
          : err.code === 'NETWORK'
            ? '네트워크 오류가 발생했습니다.'
            : err.message || '요청 처리 중 오류가 발생했습니다.';

      store.dispatch(setShowToastView({ visibility: true, message: msg }));
    }
  }
  return next(action);
};
