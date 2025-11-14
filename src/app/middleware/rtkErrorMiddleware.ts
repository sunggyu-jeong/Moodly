import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

import { store } from '@/app/store';
import type { AppError } from '@/shared/api/error/appError';
import { setShowToastView } from '@/shared/model/overlaySlice';

export const rtkErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const err = action.payload as AppError | undefined;

    const silent = (action as any)?.meta?.arg?.extraOption?.silentError === true;

    if (err && !silent) {
      const code = err.code ?? 'UNKNOWN';

      const msg =
        code === 'UNAUTHORIZED'
          ? '로그인이 필요합니다.'
          : code === 'NETWORK'
            ? '네트워크 오류입니다.'
            : '요청 처리 중 오류가 발생했습니다.';

      store.dispatch(
        setShowToastView({
          visibility: true,
          message: msg,
        }),
      );
    }
  }

  return next(action);
};
