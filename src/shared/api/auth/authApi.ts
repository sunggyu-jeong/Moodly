import { ApiResponse } from '@entities/common/response';
import { User } from '@supabase/supabase-js';
import { baseApi, wrapQueryFn } from '../base';
import {
  fetchSession,
  getAppleToken,
  getGoogleToken,
  signInWithIdToken,
  signOut,
} from './authHelpers';

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: builder => ({
    signInGoogle: builder.mutation<ApiResponse<User>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => signInWithIdToken('google', getGoogleToken));
      },
      invalidatesTags: ['EmotionDiary'],
    }),

    signInApple: builder.mutation<ApiResponse<User>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => signInWithIdToken('apple', getAppleToken));
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    initializeSession: builder.query<ApiResponse<User>, void>({
      async queryFn() {
        return wrapQueryFn(async () => fetchSession());
      },
      providesTags: ['EmotionDiary'],
    }),
    signOut: builder.mutation<ApiResponse<string>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => signOut());
      },
      invalidatesTags: ['EmotionDiary'],
    }),
  }),
});

export const {
  useSignInGoogleMutation,
  useSignInAppleMutation,
  useInitializeSessionQuery,
  useSignOutMutation,
} = authApi;
