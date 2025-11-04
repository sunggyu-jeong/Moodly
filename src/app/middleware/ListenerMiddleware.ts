import { AppCode } from '@/shared/config/errorCodes';
import { resetTo } from '@/shared/lib/navigation.util';

const appCodeHandlers: Record<
  AppCode,
  (
    errDetail: { data: { code: string; message: string } },
    listenerApi: ListenerEffectAPI<
      unknown,
      ThunkDispatch<unknown, unknown, UnknownAction>,
      unknown
    >,
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
    const message = errDetail.data?.message;
    console.log('error handler >>>>>>>>>', payload);

    // listenerApi.dispatch(
    //   setShowToastView({
    //     visibility: true,
    //     message,
    //   })
    // );
  },
});
