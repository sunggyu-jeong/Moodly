import { UserMeta, UserMetaDTO } from '@entities/auth/User.scheme';
import { ApiResponse } from '@entities/common/response';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { ApiCode, AppCode, HttpStatus } from '../../config/errorCodes';
import { isEmpty } from '../../lib';
import { getRealm } from '../../lib/realm-client.util';
import { supabase } from '../../lib/supabase.util';
import { baseFormatError } from '../base';

/**
 * 주어진 OAuth 공급자(Google 또는 Apple)에 대해 토큰을 획득하고,
 * Supabase에 ID 토큰으로 로그인 요청을 보낸 후
 * ApiResponse 형태로 결과를 반환합니다.
 *
 * @param provider  로그인 공급자 이름 ('google' 또는 'apple')
 * @param getToken  토큰을 획득하는 비동기 함수
 * @returns         로그인 성공 시 세션(Session)과 사용자(User)를,
 *                  실패 시 AuthError를 포함한 ApiResponse
 */
export async function signInWithIdToken(
  provider: 'google' | 'apple',
  getToken: () => Promise<{ token: string; nonce?: string }>
): Promise<ApiResponse<User>> {
  try {
    const { token, nonce } = await getToken();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider,
      token,
      ...(nonce ? { nonce } : {}),
    });
    if (error) throw error;
    return {
      session: data.session!,
      data: data.session!.user,
    };
  } catch (err) {
    return { error: baseFormatError(err as AuthError) };
  }
}

/**
 * Google Play Services 확인 후 Google 로그인 과정을 수행하고,
 * ID 토큰을 반환합니다.
 *
 * @returns  idToken 프로퍼티를 가진 객체
 * @throws   로그인 실패 또는 Play Services 오류 시 예외 발생
 */
export async function getGoogleToken() {
  await GoogleSignin.hasPlayServices();
  GoogleSignin.configure({ webClientId: process.env.GOOGLE_WEB_CLIENT_ID! });
  await GoogleSignin.signIn();
  const { idToken: token } = await GoogleSignin.getTokens();
  return { token };
}

/**
 * Apple 로그인 요청을 수행하고,
 * 발급된 identityToken과 nonce를 반환합니다.
 *
 * @note     사용자가 이메일 가리기 옵션을 사용할 경우, username을 받아올 수 없습니다.
 * @returns  token, nonce 프로퍼티를 가진 객체
 * @throws   identityToken 미발급 시 예외 발생
 */
export async function getAppleToken() {
  const resp = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  if (!resp.identityToken) {
    const authErr = baseFormatError(new Error('Apple 로그인 요청이 실패했어요.'));
    console.log('>>>>>>>>Apple 로그인 실패: identityToken 누락');
    authErr.status = HttpStatus.NOT_FOUND;
    authErr.code = ApiCode.NOT_FOUND;
    throw authErr;
  }
  return { token: resp.identityToken, nonce: resp.nonce };
}

/**
 * 현재 Supabase 클라이언트에 저장된 세션 정보를 조회하여
 * ApiResponse 형태로 반환합니다.
 *
 * @returns  세션이 유효하면 Session과 User를,
 *           그렇지 않으면 AuthError를 포함한 ApiResponse
 */
export async function fetchSession(): Promise<ApiResponse<User>> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return { error: baseFormatError(error) };
  }
  if (isEmpty(data.session)) {
    throw baseFormatError(new Error('로그인이 필요합니다.'), AppCode.NOT_LOGIN);
  }
  return {
    session: data.session,
    data: data.session?.user,
  };
}

/**
 * 사용자 로그아웃 요청을 수행합니다.
 * - Supabase Auth 세션을 무효화하고, 로컬 저장소에 보관된 인증 정보를 삭제합니다.
 *
 * @returns 성공 시 data에 ApiCode.SUCCESS를 담아 반환하며,
 *          실패 시 error에 형식화된 오류 정보를 담아 반환합니다.
 */
export async function signOut(): Promise<ApiResponse<string>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { data: ApiCode.SUCCESS };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

/**
 * 현재 인증 세션 정보를 조회합니다.
 * - 로컬 스토리지(또는 AsyncStorage)에서 저장된 세션을 가져오며,
 *   유효한 세션이 존재하지 않으면 null을 반환합니다.
 *
 * @returns 성공 시 data에 Session 객체를 담아 반환하며,
 *          오류 발생 시 error에 형식화된 오류 정보를 담아 반환합니다.
 */
export async function getAuthToken(): Promise<ApiResponse<Session>> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data: data.session };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function getFirstLoadStatus(): Promise<ApiResponse<boolean>> {
  try {
    const realm = getRealm();
    const meta = realm.objects<UserMeta>('UserMeta')[0];
    const isFirstLoad = meta?.is_first_load ?? true;
    return { data: isFirstLoad };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function setFirstLoadStatus(params: UserMetaDTO): Promise<ApiResponse<boolean>> {
  try {
    const realm = getRealm();
    realm.write(() => {
      realm.create<UserMeta>('UserMeta', {
        user_id: params.userId,
        is_first_load: params.isFirstLoad,
        created_at: params.createdAt,
      });
    });
    return { data: true };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}
