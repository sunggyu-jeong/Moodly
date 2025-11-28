(global as any).__DEV__ = true;
import { configureStore, createAction } from '@reduxjs/toolkit';

import { rtkErrorMiddleware } from '@/app/middleware/rtkErrorMiddleware';
import { setShowToastView } from '@/shared/model/overlaySlice';

jest.mock('@/shared/lib/supabase.util', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
  },
}));
jest.mock('@/shared/model/overlaySlice', () => ({
  setShowToastView: jest.fn(payload => ({
    type: 'overlay/setShowToastView',
    payload,
  })),
}));

jest.mock('@/shared/api/appApi', () => ({
  appApi: {
    reducerPath: 'appApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

const rejected = createAction('test/rejected', (payload: any, meta?: any) => ({
  payload,
  meta: { requestStatus: 'rejected', ...(meta ?? {}) },
}));

describe('rtkErrorMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejectedWithValue(AppError) 시, toast 호출', () => {
    const store = configureStore({
      reducer: { dummy: (s = {}) => s },
      middleware: gdm => gdm().concat(rtkErrorMiddleware),
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    store.dispatch(rejected({ code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' }));

    expect(setShowToastView).toHaveBeenCalledWith({
      visibility: true,
      message: '로그인이 필요합니다.',
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'overlay/setShowToastView',
        payload: { visibility: true, message: '로그인이 필요합니다.' },
      }),
    );
  });

  it('silentError 옵션이면 토스트 안 띄움', () => {
    const store = configureStore({
      reducer: { dummy: (s = {}) => s },
      middleware: gdm => gdm().concat(rtkErrorMiddleware),
    });

    const silentRejected = createAction('test/rejected', (payload: any) => ({
      payload,
      meta: {
        requestStatus: 'rejected',
        arg: { extraOptions: { silentError: true } },
      },
    }));

    store.dispatch(silentRejected({ code: 'SERVER_ERROR', message: '서버오류' }));

    expect(setShowToastView).not.toHaveBeenCalled();
  });

  it('ERROR_MESSAGE_MAP에 있는 코드면 매핑된 메시지 사용', () => {
    const store = configureStore({
      reducer: { dummy: (s = {}) => s },
      middleware: gdm => gdm().concat(rtkErrorMiddleware),
    });

    store.dispatch(rejected({ code: 'NETWORK', message: 'Network Failed' }));

    expect(setShowToastView).toHaveBeenCalledWith({
      visibility: true,
      message: '네트워크 연결을 확인해주세요.',
    });
  });

  it('fulfilled 액션은 무시', () => {
    const store = configureStore({
      reducer: { dummy: (s = {}) => s },
      middleware: gdm => gdm().concat(rtkErrorMiddleware),
    });

    const fulfilled = createAction('test/fulfilled');
    store.dispatch(fulfilled());

    expect(setShowToastView).not.toHaveBeenCalled();
  });

  it('/rejected로 끝나는 액션 타입도 처리', () => {
    const store = configureStore({
      reducer: { dummy: (s = {}) => s },
      middleware: gdm => gdm().concat(rtkErrorMiddleware),
    });

    const autoRejected = createAction<{ code: string; message: string }>('users/login/rejected');

    store.dispatch(autoRejected({ code: 'BAD_REQUEST', message: '잘못된 요청' }));

    expect(setShowToastView).toHaveBeenCalledWith({
      visibility: true,
      message: '잘못된 요청',
    });
  });
});
