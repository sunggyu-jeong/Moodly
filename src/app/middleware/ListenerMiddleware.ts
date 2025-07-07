import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { isRejectedWithValue } from '@reduxjs/toolkit';
import { parseApiError } from '@shared/api/parseApiError';
import { ERROR_MESSAGE_MAP } from '@shared/config/errorCodes';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const payload = action.payload;
    if (!payload || typeof payload !== 'object') {
      console.warn('listenerMiddleware: 예상치 못한 payload:', payload);
      return;
    }

    const code = parseApiError(payload as FetchBaseQueryError);
    const message = ERROR_MESSAGE_MAP[code];

    listenerApi.dispatch(
      setShowToastView({
        visibility: true,
        message,
      })
    );
  },
});
