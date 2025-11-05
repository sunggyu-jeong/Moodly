import {
  createListenerMiddleware,
  isRejectedWithValue,
  type ListenerEffectAPI,
  type TypedStartListening,
} from '@reduxjs/toolkit';

import { AppCode } from '@/shared/config/errorCodes';
import { resetTo } from '@/shared/lib/navigation.util';

import type { AppDispatch, RootState } from '@/app/store';

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening = listenerMiddleware.startListening as AppStartListening;

type AppCodeHandler = (
  errDetail: { data: { code: string; message: string } },
  api: ListenerEffectAPI<RootState, AppDispatch>,
) => void;

const appCodeHandlers: Record<AppCode, AppCodeHandler> = {
  [AppCode.NOT_LOGIN]: _errDetail => {
    resetTo('Login');
  },
};

startAppListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const payload = action.payload as
      | { status?: number; data?: { code?: string; message?: string } }
      | undefined;

    if (!payload || typeof payload !== 'object') {
      console.warn('listenerMiddleware: 예상치 못한 payload:', payload);
      return;
    }

    const appCode = payload.data?.code as AppCode | undefined;
    const handler = appCode ? appCodeHandlers[appCode] : undefined;

    if (handler) {
      handler(payload as { data: { code: string; message: string } }, listenerApi);
      return;
    }
    console.log('error handler >>>>>>>>>', payload);
  },
});

export default listenerMiddleware;
