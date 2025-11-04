import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, type User } from '@react-native-google-signin/google-signin';
import { appApi } from '@/shared/api/AppApi';
import { Platform } from 'react-native';
import * as Application from 'expo-application';

import type { SetUserInfoInput, SignInProviderInput, UserInfo } from '../model/auth.types';
import { isIphone } from '@/shared/lib/user.util';
import { ApiCode } from '@/shared/api/Error';
import { isEmpty } from '@/shared/lib/value.util';

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID!,
});

async function getDeviceId(): Promise<string> {
  if (isIphone()) {
    const id = await Application.getIosIdForVendorAsync();
    return id ?? 'unknown-ios-device';
  }
  const id = Application.getAndroidId();
  return id ?? 'unknown-android-device';
}

export async function getGoogleToken() {
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signIn();
  const { idToken: token } = await GoogleSignin.getTokens();
  return { token };
}

export async function getAppleToken() {
  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    const err = new Error('이 기기에서는 Apple 로그인이 지원되지 않습니다.');
    Object.assign(err, { status: 400, code: ApiCode.BAD_REQUEST });
    throw err;
  }

  const resp = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
  });

  if (!resp.identityToken) {
    const error = new Error('Apple 로그인 요청이 실패했어요.');
    Object.assign(error, { status: 404, code: ApiCode.NOT_FOUND });
    throw error;
  }

  return {
    token: resp.identityToken,
    nonce: null,
  };
}

export const authApi = appApi.injectEndpoints({
  endpoints: build => ({
    signInWithProvider: build.mutation<User, SignInProviderInput>({
      query:
        ({ provider }) =>
        async client => {
          const getToken = provider === 'google' ? getGoogleToken : getAppleToken;
          const result = await getToken();
          const token = result.token;
          const nonce = (result as { nonce?: string }).nonce;

          const { data, error } = await client.auth.signInWithIdToken({
            provider,
            token,
            ...(nonce ? { nonce } : {}),
          });
          return { data: data?.user ?? null, error };
        },
      invalidatesTags: ['User', 'Session'],
    }),

    signOut: build.mutation<boolean, void>({
      query: () => async client => {
        const { error } = await client.auth.signOut();
        return { data: isEmpty(error), error };
      },
      invalidatesTags: ['User', 'Session'],
    }),

    fetchSession: build.query<User | null, void>({
      query: () => async client => {
        const { data, error } = await client.auth.getSession();
        if (!data.session && !error) {
          return { data: null, error: null };
        }
        return { data: data.session?.user ?? null, error };
      },
      providesTags: result =>
        result
          ? [
              { type: 'Session', id: 'CURRENT' },
              { type: 'User', id: 'ME' },
            ]
          : [],
    }),

    getUserInfo: build.query<UserInfo, void>({
      query: () => async client => {
        const {
          data: { user },
        } = await client.auth.getUser();
        if (!user) {
          return {
            error: {
              message: '로그인이 필요합니다.',
              status: 401,
              code: 'NOT_LOGIN',
            },
            data: null,
          };
        }
        const { data, error } = await client
          .from('tb_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        return { data, error };
      },
      providesTags: result => (result ? [{ type: 'User', id: 'ME' }] : []),
    }),

    setUserInfo: build.mutation<boolean, SetUserInfoInput>({
      query: payload => async client => {
        const {
          data: { user },
        } = await client.auth.getUser();
        if (!user) {
          return {
            error: {
              message: '로그인이 필요합니다.',
              status: 401,
              code: 'NOT_LOGIN',
            },
            data: null,
          };
        }
        const { error } = await client.from('tb_profiles').upsert({
          id: user.id,
          nickname: payload.nickname,
          email: user.email,
        });
        return { data: !error, error };
      },
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    upsertPushToken: build.mutation<boolean, { token: string }>({
      query:
        ({ token }) =>
        async client => {
          const {
            data: { user },
          } = await client.auth.getUser();
          if (!user) return { data: false, error: '로그인 필요' };

          const deviceId = await getDeviceId();
          const { error } = await client.from('push_tokens').upsert({
            user_id: user.id,
            device_id: deviceId,
            token,
            platform: Platform.OS,
            last_seen_at: new Date().toISOString(),
          });
          return { data: !error, error };
        },
    }),
    deletePushToken: build.mutation<boolean, void>({
      query: () => async client => {
        const {
          data: { user },
        } = await client.auth.getUser();
        if (!user) return { data: false, error: '로그인 필요' };

        const deviceId = await getDeviceId();
        const { error } = await client
          .from('push_tokens')
          .delete()
          .match({ user_id: user.id, device_id: deviceId });

        return { data: !error, error };
      },
    }),
  }),
});

export const {
  useSignInWithProviderMutation,
  useSignOutMutation,
  useFetchSessionQuery,
  useLazyFetchSessionQuery,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useSetUserInfoMutation,
  useUpsertPushTokenMutation,
  useDeletePushTokenMutation,
} = authApi;
