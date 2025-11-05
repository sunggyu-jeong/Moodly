export const ApiCode = {
  UNKNOWN: 'UNKNOWN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK: 'NETWORK',
} as const;

export type ApiCode = (typeof ApiCode)[keyof typeof ApiCode];

export interface AppError {
  code: ApiCode;
  message: string;
  status?: number;
  cause?: unknown;
}

const toStatusCode = (cause: unknown): number | undefined => {
  if (typeof cause === 'object' && cause && 'status' in cause) {
    const s = (cause as { status?: number }).status;
    if (typeof s === 'number') {
      return s;
    }
  }
  return undefined;
};

export const toAppError = (e: unknown): AppError => {
  if (typeof e === 'object' && e) {
    const err = e as { message?: string; status?: number; code?: string };
    const msg = err.message ?? '알 수 없는 오류가 발생했습니다.';
    const status = err.status ?? toStatusCode(e);

    if (status === 401) {
      return { code: ApiCode.UNAUTHORIZED, message: msg, status, cause: e };
    }
    if (status === 403) {
      return { code: ApiCode.FORBIDDEN, message: msg, status, cause: e };
    }
    if (status === 404) {
      return { code: ApiCode.NOT_FOUND, message: msg, status, cause: e };
    }
    if (status === 409) {
      return { code: ApiCode.CONFLICT, message: msg, status, cause: e };
    }
    if (status === 400) {
      return { code: ApiCode.BAD_REQUEST, message: msg, status, cause: e };
    }
    if (status === 429) {
      return { code: ApiCode.RATE_LIMIT, message: msg, status, cause: e };
    }

    return { code: ApiCode.UNKNOWN, message: msg, status, cause: e };
  }

  const message = typeof e === 'string' ? e : '알 수 없는 오류가 발생했습니다.';
  return { code: ApiCode.UNKNOWN, message, cause: e };
};
