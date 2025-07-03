export enum ApiCode {
  SUCCESS = 'SUCCESS',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  LOGIN_CANCELLED = 'LOGIN_CANCELLED',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export const ERROR_MESSAGE_MAP: Record<ApiCode, string> = {
  [ApiCode.SUCCESS]: '요청이 성공적으로 처리되었습니다.',
  [ApiCode.BAD_REQUEST]: '잘못된 요청입니다.',
  [ApiCode.UNAUTHORIZED]: '인증이 필요합니다.',
  [ApiCode.FORBIDDEN]: '권한이 없습니다.',
  [ApiCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ApiCode.LOGIN_CANCELLED]: '로그인 요청이 취소되었습니다.',
  [ApiCode.SERVER_ERROR]: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ApiCode.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
};
