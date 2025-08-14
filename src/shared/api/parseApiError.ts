import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ApiCode } from '@/shared/config';

export function parseApiError(error: FetchBaseQueryError | SerializedError | undefined): ApiCode {
  if (!error) {
    return ApiCode.UNKNOWN;
  }

  if ('status' in error && typeof error.status === 'number') {
    switch (error.status) {
      case 400:
        return ApiCode.BAD_REQUEST;
      case 401:
        return ApiCode.UNAUTHORIZED;
      case 403:
        return ApiCode.FORBIDDEN;
      case 404:
        return ApiCode.NOT_FOUND;
      case 0:
      case 500:
        return ApiCode.SERVER_ERROR;
      default:
        return ApiCode.UNKNOWN;
    }
  }

  // SerializedError (직렬화된 JS 예외)
  return ApiCode.UNKNOWN;
}
