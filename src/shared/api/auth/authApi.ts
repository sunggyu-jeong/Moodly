import { UserMetaDTO } from '@entities/auth/User.scheme';
import { User } from '@supabase/supabase-js';
import { baseApi, wrapQueryFn } from '../base';
import {
  fetchSession,
  getAppleToken,
  getFirstLoadStatus,
  getGoogleToken,
  setFirstLoadStatus,
  signInWithIdToken,
  signOut,
} from './authService';

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: builder => ({
    signInGoogle: builder.mutation<User, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => signInWithIdToken('google', getGoogleToken));
      },
      invalidatesTags: ['Auth'],
    }),
    signInApple: builder.mutation<User, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => signInWithIdToken('apple', getAppleToken));
      },
      invalidatesTags: ['Auth'],
    }),
    initializeSession: builder.query<User, void>({
      async queryFn() {
        return wrapQueryFn(async () => fetchSession());
      },
      providesTags: ['Auth'],
    }),
    signOut: builder.mutation<string, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => signOut());
      },
      invalidatesTags: ['Auth'],
    }),
    getFirstLoadStatus: builder.query<boolean, void>({
      async queryFn() {
        return wrapQueryFn(async () => getFirstLoadStatus());
      },
      providesTags: ['Auth'],
    }),
    setFirstLoadStatus: builder.mutation<boolean, UserMetaDTO>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => setFirstLoadStatus(_arg));
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useSignInGoogleMutation,
  useSignInAppleMutation,
  useLazyInitializeSessionQuery,
  useGetFirstLoadStatusQuery,
  useSetFirstLoadStatusMutation,
  useSignOutMutation,
} = authApi;
