import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { Platform } from 'react-native';

import { store } from '@/app/store';
import type { AppError } from '@/shared/api/error/appError';
import { supabase } from '@/shared/lib/supabase.util';
import { setShowToastView } from '@/shared/model/overlaySlice';

export const rtkErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const err = action.payload as AppError | undefined;
    const endpointName = (action as any)?.meta?.arg?.endpointName || 'UNKNOWN_ENDPOINT';

    const silent = (action as any)?.meta?.arg?.extraOption?.silentError === true;

    if (err) {
      const code = err.code ?? 'UNKNOWN';
      const errorMessage = err.message || 'No error message';

      supabase
        .from('tb_error_logs')
        .insert({
          error_code: code,
          error_message: errorMessage,
          api_endpoint: endpointName,
          payload: JSON.stringify(err),
          device_info: Platform.OS,
        })
        .then(({ error }: any) => {
          if (error) console.log('Failed to log error to Supabase:', error);
        });

      if (!silent) {
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
  }

  return next(action);
};
