export const API_CODE = {
  SUCCESS: 'SUCCESS',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK: 'NETWORK',
  LOGIN_CANCELLED: 'LOGIN_CANCELLED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ApiCode = (typeof API_CODE)[keyof typeof API_CODE];

export enum AppCode {
  NOT_LOGIN = 'S1001',
}

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const ERROR_MESSAGE_MAP: Record<ApiCode, string> = {
  [API_CODE.SUCCESS]: '요청이 성공적으로 처리되었습니다.',
  [API_CODE.BAD_REQUEST]: '요청이 잘못되었어요.',
  [API_CODE.UNAUTHORIZED]: '인증이 필요합니다.',
  [API_CODE.FORBIDDEN]: '접근 권한이 없습니다.',
  [API_CODE.NOT_FOUND]: '요청하신 내용을 찾을 수 없어요.',
  [API_CODE.CONFLICT]: '요청 충돌이 발생했습니다.',
  [API_CODE.RATE_LIMIT]: '요청이 너무 많아요. 잠시 후 시도해주세요.',
  [API_CODE.SERVER_ERROR]: '서버에 문제가 생겼어요. 잠시 후 다시 시도해주세요.',
  [API_CODE.NETWORK]: '네트워크 연결을 확인해주세요.',
  [API_CODE.LOGIN_CANCELLED]: '로그인 요청이 취소되었습니다.',
  [API_CODE.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
};
