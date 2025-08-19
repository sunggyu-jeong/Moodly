import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin, type User } from '@react-native-google-signin/google-signin';
import { appApi } from '@shared/api/AppApi';
import { ApiCode } from '@shared/config';

import type { SetUserInfoInput, SignInProviderInput, UserInfo } from '../model/auth.types';

export async function getGoogleToken() {
  await GoogleSignin.hasPlayServices();
  GoogleSignin.configure({
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID!,
  });
  await GoogleSignin.signIn();
  const { idToken: token } = await GoogleSignin.getTokens();
  return { token };
}

export async function getAppleToken() {
  const resp = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  if (!resp.identityToken) {
    console.log('>>>>>>>>Apple 로그인 실패: identityToken 누락');
    const error = new Error('Apple 로그인 요청이 실패했어요.');
    Object.assign(error, { status: 404, code: ApiCode.NOT_FOUND });
    throw error;
  }
  return { token: resp.identityToken, nonce: resp.nonce };
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

    signOut: build.mutation<null, void>({
      query: () => async client => {
        const { error } = await client.auth.signOut();
        return { data: null, error };
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
          const error = new Error('로그인이 필요합니다.');
          Object.assign(error, { status: 401, code: 'NOT_LOGIN' });
          throw error;
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
          const error = new Error('로그인이 필요합니다.');
          Object.assign(error, { status: 401, code: 'NOT_LOGIN' });
          throw error;
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
  }),
});

// 생성된 훅 자동 export
export const {
  useSignInWithProviderMutation,
  useSignOutMutation,
  useFetchSessionQuery,
  useLazyFetchSessionQuery,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useSetUserInfoMutation,
} = authApi;
