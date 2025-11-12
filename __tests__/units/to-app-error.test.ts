import { API_CODE } from '@/shared/api/error/apiCode';
import { toAppError } from '@/shared/api/error/mapper';

describe('toAppError', () => {
  it('status → ApiCode 매핑(401/403/404/400/409/429/500)', () => {
    const cases = [
      [{ status: 401, message: 'x' }, API_CODE.UNAUTHORIZED],
      [{ status: 403, message: 'x' }, API_CODE.FORBIDDEN],
      [{ status: 404, message: 'x' }, API_CODE.NOT_FOUND],
      [{ status: 400, message: 'x' }, API_CODE.BAD_REQUEST],
      [{ status: 409, message: 'x' }, API_CODE.CONFLICT],
      [{ status: 429, message: 'x' }, API_CODE.RATE_LIMIT],
      [{ status: 500, message: 'x' }, API_CODE.SERVER_ERROR],
      [{ status: 418, message: 'x' }, API_CODE.UNKNOWN],
    ] as const;

    for (const [e, code] of cases) {
      const a = toAppError(e);
      expect(a.code).toBe(code);
      expect(a.status).toBe(e.status);
      expect(a.message).toBe('x');
      expect(a.causeText).toBeDefined();
      expect('cause' in (a as any)).toBe(false);
    }
  });

  it('네트워크 계열 메시지 → NETWORK', () => {
    const e = { message: 'Network request failed' };
    const a = toAppError(e);
    expect(a.code).toBe(API_CODE.NETWORK);
    expect(a.message).toContain('네트워크');
  });

  it('이미 우리 코드(API_CODE.*)로 던진 경우 -> 그대로 유지', () => {
    const e = { code: API_CODE.LOGIN_CANCELLED, message: '사용자가 취소함' };
    const a = toAppError(e);
    expect(a.code).toBe(API_CODE.LOGIN_CANCELLED);
    expect(a.message).toBe('사용자가 취소함');
  });

  it('string 오류 -> UNKNOWN + message 그대로', () => {
    const a = toAppError('plain error');
    expect(a.code).toBe(API_CODE.UNKNOWN);
    expect(a.message).toBe('plain error');
  });

  it('rawCode 보존(meta.rawCode)', () => {
    const a = toAppError({ code: 'E_SOMETHING', message: 'msg' });
    expect(a.code).toBe(API_CODE.UNKNOWN);
    expect(a.meta?.rawCode).toBe('E_SOMETHING');
  });
});
