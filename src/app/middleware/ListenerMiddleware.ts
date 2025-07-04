import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { createListenerMiddleware, SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseApiError } from '@shared/api/parseApiError';
import { ERROR_MESSAGE_MAP } from '@shared/config/errorCodes';
import { isRejectedWithValue } from '@reduxjs/toolkit';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const err = action.payload as FetchBaseQueryError | SerializedError | undefined;
    const code = parseApiError(err);

    const message = ERROR_MESSAGE_MAP[code];

    listenerApi.dispatch(
      setShowToastView({
        visibility: true,
        message,
      })
    );
  },
});
