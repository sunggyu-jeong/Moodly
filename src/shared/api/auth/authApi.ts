import { ApiResponse } from '@entities/common/response';
import { Session, User } from '@supabase/supabase-js';
import { baseApi, wrapQueryFn } from '../base';
import {
  fetchSession,
  getAppleToken,
  getAuthToken,
  getGoogleToken,
  signInWithIdToken,
  signOut,
} from './authService';

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: builder => ({
    signInGoogle: builder.mutation<ApiResponse<User>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => signInWithIdToken('google', getGoogleToken));
      },
      invalidatesTags: ['Auth'],
    }),

    signInApple: builder.mutation<ApiResponse<User>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => signInWithIdToken('apple', getAppleToken));
      },
      invalidatesTags: ['Auth'],
    }),
    initializeSession: builder.query<ApiResponse<User>, void>({
      async queryFn() {
        return wrapQueryFn(async () => fetchSession());
      },
      providesTags: ['Auth'],
    }),
    signOut: builder.mutation<ApiResponse<string>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => signOut());
      },
      invalidatesTags: ['Auth'],
    }),
    authToken: builder.query<ApiResponse<Session | null>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => getAuthToken());
      },
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useSignInGoogleMutation,
  useSignInAppleMutation,
  useLazyInitializeSessionQuery,
  useSignOutMutation,
  useAuthTokenQuery,
} = authApi;
