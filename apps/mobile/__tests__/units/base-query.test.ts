import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { API_CODE } from '@/shared/api/error/apiCode';
import { toAppError } from '@/shared/api/error/mapper';

const baseQuery: BaseQueryFn<(c: any) => Promise<any>, unknown, any> = async handler => {
  try {
    const r = await handler({});
    if (r && typeof r === 'object' && 'data' in r && 'error' in r) {
      if (r.error) return { error: toAppError(r.error) };
      return { data: r.data };
    }
    return { data: r };
  } catch (e) {
    return { error: toAppError(e) };
  }
};

describe('baseQuery error normalization', () => {
  it('throw 케이스를 AppError로 변환', async () => {
    const res = await baseQuery(
      async () => {
        throw { status: 401, message: 'x' };
      },
      {} as any,
      {} as any,
    );
    expect('error' in res!).toBe(true);
    expect((res as any).error.code).toBe(API_CODE.UNAUTHORIZED);
  });

  it('{data,error} 패턴에서 error만 있을 때, AppError로 래핑', async () => {
    const res = await baseQuery(
      async () => ({ data: null, error: { status: 429, message: 'y' } }),
      {} as any,
      {} as any,
    );
    expect((res as any).error.code).toBe(API_CODE.RATE_LIMIT);
  });

  it('성공 케이스는 data 반환', async () => {
    const res = await baseQuery(async () => ({ data: 'OK', error: null }), {} as any, {} as any);
    expect((res as any).data).toBe('OK');
  });
});
