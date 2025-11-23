import { API_CODE, ApiCode, HttpStatus } from '@/shared/api/error/apiCode';
import { AppError } from '@/shared/api/error/appError';

const toStatusCode = (v: unknown): number | undefined => {
  if (!v || typeof v !== 'object') return undefined;
  const any = v as any;
  if (typeof any.status === 'number') return any.status;
  if (any.response && typeof any.response.status === 'number') return any.response.status;
  return undefined;
};

const toCauseText = (e: unknown): string | undefined => {
  if (e instanceof Error) return `${e.name}: ${e.message}`;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return undefined;
  }
};

const byStatus = (s?: number): ApiCode => {
  if (s === HttpStatus.UNAUTHORIZED) return API_CODE.UNAUTHORIZED;
  if (s === HttpStatus.FORBIDDEN) return API_CODE.FORBIDDEN;
  if (s === HttpStatus.NOT_FOUND) return API_CODE.NOT_FOUND;
  if (s === HttpStatus.BAD_REQUEST) return API_CODE.BAD_REQUEST;
  if (s === 409) return API_CODE.CONFLICT;
  if (s === 429) return API_CODE.RATE_LIMIT;
  if (s === HttpStatus.INTERNAL_SERVER_ERROR) return API_CODE.SERVER_ERROR;
  return API_CODE.UNKNOWN;
};

const isNetworkLike = (msg?: string) =>
  !!msg && /Network\srequest\sfailed|Failed\sto\sfetch|TypeError/i.test(msg);

export const toAppError = (e: unknown): AppError => {
  const status = toStatusCode(e);
  const causeText = toCauseText(e) ?? '';

  let message = '알 수 없는 오류가 발생했습니다.';
  if (typeof e === 'string') message = e;
  else if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string')
    message = (e as any).message as string;

  if (isNetworkLike(message)) {
    return { code: API_CODE.NETWORK, message: '네트워크 연결을 확인해주세요.', status, causeText };
  }

  const rawCode =
    e && typeof e === 'object' && 'code' in e && typeof (e as any).code === 'string'
      ? ((e as any).code as string)
      : undefined;
  if (rawCode && (Object.values(API_CODE) as string[]).includes(rawCode)) {
    const meta =
      e && typeof e === 'object' && 'meta' in e
        ? ((e as any).meta as Record<string, unknown>)
        : undefined;
    return { code: rawCode as ApiCode, message, status, causeText, ...(meta ? { meta } : {}) };
  }

  const code = byStatus(status);
  return { code, message, status, causeText, ...(rawCode ? { meta: { rawCode } } : {}) };
};
