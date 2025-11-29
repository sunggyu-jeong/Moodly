// __tests__/units/rtk-error-middleware.test.ts
(global as any).__DEV__ = true;
import { configureStore, createAction } from '@reduxjs/toolkit';

import { rtkErrorMiddleware } from '@/app/middleware/rtkErrorMiddleware';
import { setShowToastView } from '@/shared/model/overlaySlice';

// 1. [중요] 실제 의존성 완전히 차단 (Circular Dependency 방지)
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

// appApi가 실제 store를 참조하지 않도록 가짜 객체로 대체
jest.mock('@/shared/api/appApi', () => ({
  appApi: {
    reducerPath: 'appApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

// 2. 테스트용 액션 정의
const rejected = createAction('test/rejected', (payload: any, meta?: any) => ({
  payload,
  meta: { requestStatus: 'rejected', ...(meta ?? {}) },
}));

describe('rtkErrorMiddleware', () => {
  let store: any;

  // 3. 테스트마다 가짜 스토어 새로 생성
  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        // 테스트용 더미 리듀서
        dummy: (state = {}) => state,
      },
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }).concat(rtkErrorMiddleware),
    });
    jest.spyOn(store, 'dispatch');
  });

  it('rejectedWithValue(AppError) 시, toast 호출', () => {
    store.dispatch(rejected({ code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' }));

    expect(setShowToastView).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '로그인이 필요합니다.',
      }),
    );
  });

  it('silentError 옵션이면 토스트 안 띄움', () => {
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

  it('fulfilled 액션은 무시', () => {
    const fulfilled = createAction('test/fulfilled');
    store.dispatch(fulfilled());

    expect(setShowToastView).not.toHaveBeenCalled();
  });
});
