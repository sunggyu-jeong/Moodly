import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import {
  createListenerMiddleware,
  isRejectedWithValue,
  ListenerEffectAPI,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { parseApiError } from '@shared/api/parseApiError';
import { AppCode, ERROR_MESSAGE_MAP } from '@shared/config/errorCodes';
import { resetTo } from '@shared/lib';

const appCodeHandlers: Record<
  AppCode,
  (
    errDetail: { data: { code: string; message: string } },
    listenerApi: ListenerEffectAPI<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>
  ) => void
> = {
  [AppCode.NOT_LOGIN]: _errDetail => {
    resetTo('Login');
  },
};

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const payload = action.payload;
    if (!payload || typeof payload !== 'object') {
      console.warn('listenerMiddleware: 예상치 못한 payload:', payload);
      return;
    }
    const errDetail = payload as { status: number; data: { code: string; message: string } };
    const appCode = errDetail.data?.code as AppCode;
    const handler = appCodeHandlers[appCode];
    if (handler) {
      handler(errDetail, listenerApi);
      return;
    }
    const apiCode = parseApiError(payload as FetchBaseQueryError);

    const message = errDetail.data?.message || ERROR_MESSAGE_MAP[apiCode];

    listenerApi.dispatch(
      setShowToastView({
        visibility: true,
        message,
      })
    );
  },
});
