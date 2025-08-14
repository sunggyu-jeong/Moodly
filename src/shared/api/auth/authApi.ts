import { UserMetaDTO } from '@entities/auth/User.scheme';
import { User } from '@supabase/supabase-js';
import { baseApi, wrapQueryFn } from '../base';
import {
  fetchFirstLaunchFlag,
  fetchSession,
  getAppleToken,
  getGoogleToken,
  getUserInfo,
  saveFirstLaunchFlag,
  setUserInfo,
  signInWithIdToken,
  signOut,
} from './authService';

export interface UserInfo {
  id: string;
  nickname: string;
  created_at: string;
  email: string;
}

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
    getUserInfo: builder.query<UserInfo, void>({
      async queryFn() {
        return wrapQueryFn(async () => getUserInfo());
      },
      providesTags: ['Auth'],
    }),
    setUserInfo: builder.mutation<boolean, Pick<UserInfo, 'nickname'>>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => setUserInfo(_arg));
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
    fetchFirstLaunchFlag: builder.query<boolean, void>({
      async queryFn() {
        return wrapQueryFn(async () => fetchFirstLaunchFlag());
      },
      providesTags: ['Auth'],
    }),
    saveFirstLaunchFlag: builder.mutation<boolean, UserMetaDTO>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(async () => saveFirstLaunchFlag(_arg));
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useSignInGoogleMutation,
  useSignInAppleMutation,
  useLazyInitializeSessionQuery,
  useLazyFetchFirstLaunchFlagQuery,
  useSaveFirstLaunchFlagMutation,
  useSignOutMutation,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useSetUserInfoMutation,
} = authApi;
