import { ApiResponse } from '@entities/common/response';
import { HOT_UPDATER_SUPABASE_URL } from '@env';
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ApiCode } from '@shared/config/errorCodes';
import { AuthError } from '@supabase/supabase-js';

import { isEmpty, isNotEmpty, supabase } from '@/shared/lib';

/**
 * 공통 API 인스턴스를 생성합니다.
 * - reducerPath: 'api'
 * - tagTypes: ['EmotionDiary']
 * - baseQuery: fetchBaseQuery로 Supabase URL 설정
 */
export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['EmotionDiary', 'Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: HOT_UPDATER_SUPABASE_URL,
  }),
  endpoints: () => ({}),
});

/**
 * 오류 객체를 Supabase AuthError 형태로 변환합니다.
 * @param err Partial<AuthError> 또는 일반 Error 객체
 * @returns AuthError 인스턴스 (status, code, message 포함)
 */
export const baseFormatError = (err: Partial<AuthError> | Error, code: string | null = null) => {
  // 이미 AuthError라면 그대로 사용
  if ('__isAuthError' in err && err.__isAuthError) {
    return err as unknown as AuthError;
  }

  // status 추출 (없으면 500)
  const status = 'status' in err && typeof err.status === 'number' ? err.status : 500;

  // message 추출 (Error.message 혹은 문자열 변환)
  const message = err.message ?? String(err);

  // Error 인스턴스 생성
  const authErr = new Error(message) as AuthError;
  authErr.status = status;

  if (isNotEmpty(code)) {
    authErr.code = code;
  }

  return authErr;
};

/**
 * QueryFn을 감싸 RTK Query가 요구하는 반환값 구조로 변환합니다.
 *
 * @template T API 호출 결과 데이터 타입
 * @param fn ApiResponse<T>를 반환하는 비동기 함수
 * @returns QueryReturnValue<ApiResponse<T>, FetchBaseQueryError, FetchBaseQueryMeta>
 * - 성공 시 `{ data: ApiResponse<T> }`
 * - 실패 시 `{ error: FetchBaseQueryError }`
 */
export async function wrapQueryFn<T>(
  fn: () => Promise<ApiResponse<T>>,
): Promise<{ data: T } | { error: FetchBaseQueryError }> {
  try {
    const result = await fn();
    if (result.error) {
      const { code, message } = result.error;
      return {
        error: {
          status: typeof code === 'number' ? code : 400,
          data: { code, message },
        },
      };
    }
    return { data: result.data! };
  } catch (rawErr) {
    const authErr = rawErr as AuthError;
    return {
      error: {
        status: typeof authErr.status === 'number' ? authErr.status : 500,
        data: {
          code: authErr.code ?? ApiCode.UNKNOWN,
          message: authErr.message,
        },
      },
    };
  }
}

/**
 * 로그인 상태에 따라 저장소 호출을 분기 처리합니다.
 *
 * @template T
 * @param realmCall  Realm 기반 로직을 수행하는 함수. 로그인되지 않았을 때 실행됩니다.
 * @param sbCall     Supabase 기반 로직을 수행하는 함수. 로그인되어 있을 때 실행됩니다.
 * @returns          Realm 또는 Supabase 호출 결과를 담은 Promise<T>
 */
export async function fetchWithAuth<T>(
  realmCall: () => Promise<T>,
  sbCall: () => Promise<T>,
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  return isEmpty(data) ? realmCall() : sbCall();
}
