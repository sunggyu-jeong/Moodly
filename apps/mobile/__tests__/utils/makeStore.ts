import { configureStore, createSlice } from '@reduxjs/toolkit';
import { type BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';

import { rtkErrorMiddleware } from '@/app/middleware/rtkErrorMiddleware';
import overlaySlice from '@/shared/model/overlaySlice';

export function makeStore(baseQuery: BaseQueryFn<any, unknown, any>) {
  const testApi = createApi<BaseQueryFn<any, unknown, any>, any, 'testApi', string>({
    reducerPath: 'testApi',
    baseQuery,
    tagTypes: ['_TEST_'] as const,
    endpoints: build => ({
      ok: build.query<string, void>({ query: () => async () => 'OK' }),
      failThrow: build.query<any, { e: unknown }>({
        query:
          ({ e }) =>
          async () => {
            throw e;
          },
      }),
      failReturn: build.query<any, { error: unknown }>({
        query:
          ({ error }) =>
          async () => ({ data: null, error }),
      }),
      silentFail: build.query<any, { e: unknown }>({
        query:
          ({ e }) =>
          async () => {
            throw e;
          },
        extraOptions: { silentError: true },
      }),
    }),
  });

  const dummy = createSlice({ name: 'dummy', initialState: {}, reducers: {} });

  const store = configureStore({
    reducer: {
      [testApi.reducerPath]: testApi.reducer,
      overlay: overlaySlice,
      dummy: dummy.reducer,
    },
    middleware: gdm =>
      gdm({ serializableCheck: false }).concat(testApi.middleware, rtkErrorMiddleware),
  });

  return { store, testApi };
}
