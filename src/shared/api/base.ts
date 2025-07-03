import { HOT_UPDATER_SUPABASE_URL } from '@env';
import { SerializedError } from '@reduxjs/toolkit';
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react';
import { AuthError } from '@supabase/supabase-js';
import { ApiResponse } from '../../entities/common/response';

/**
 * 공통 API 인스턴스를 생성합니다.
 * - reducerPath: 'api'
 * - tagTypes: ['EmotionDiary']
 * - baseQuery: fetchBaseQuery로 Supabase URL 설정
 */
export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['EmotionDiary'],
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
export const baseFormatError = (err: Partial<AuthError> | Error) => {
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
  authErr.code = 'AUTH_ERROR';

  return authErr;
};

/**
 * QueryFn을 감싸 RTK Query가 요구하는 반환값 구조로 변환합니다.
 * @template T API 호출 결과 데이터 타입
 * @param fn ApiResponse<T>를 반환하는 비동기 함수
 * @returns QueryReturnValue<ApiResponse<T>, FetchBaseQueryError, FetchBaseQueryMeta>
 * - 성공 시 `{ data: ApiResponse<T> }`
 * - 실패 시 `{ error: FetchBaseQueryError }`
 */
export async function wrapQueryFn<T>(
  fn: () => Promise<ApiResponse<T>>
): Promise<QueryReturnValue<ApiResponse<T>, FetchBaseQueryError, FetchBaseQueryMeta>> {
  const result = await fn();
  if (result.error) {
    return {
      error: {
        status: typeof result?.error?.code === 'number' ? result.error.code : 400,
        data: result.error,
      },
    };
  }
  return { data: result };
}

/**
 * 에러 객체에서 사용자에게 보여줄 메시지를 추출합니다.
 *
 * @param err  RTK Query 훅이 반환한 FetchBaseQueryError 또는 SerializedError 객체 (또는 undefined)
 * @returns     추출된 에러 메시지 문자열, 없으면 undefined
 */
export function extractErrorMessage(
  err?: FetchBaseQueryError | SerializedError
): string | undefined {
  if (!err) return undefined;

  // SerializedError 타입인 경우
  if ('message' in err && err.message) {
    return err.message;
  }

  // FetchBaseQueryError 타입인 경우
  if ('error' in err && typeof err.error === 'string') {
    return err.error;
  }

  // HTTP 에러 응답 본문(data)에 메시지가 문자열로 담겨있을 때
  if ('data' in err) {
    const d = err.data;
    if (typeof d === 'string') return d;
    try {
      return JSON.stringify(d);
    } catch {
      return String(d);
    }
  }

  return undefined;
}
