import type { SupabaseClient, User } from '@supabase/supabase-js';

import { requireUser, requireUserId, withAuth } from '@/shared/api/authGuard';
import { API_CODE, AppCode } from '@/shared/api/error/apiCode';

const makeClient = (user?: Partial<User> | null, error?: any) =>
  ({
    auth: {
      getUser: jest.fn(async () => ({
        data: {
          user: user === undefined || user === null ? null : { id: user.id || 'u1', ...user },
        },
        error,
      })),
    },
  }) as unknown as SupabaseClient;

describe('auth-guard', () => {
  it('requireUser -> user 반환', async () => {
    const client = makeClient({});

    const user = await requireUser(client);
    expect(user).not.toBeNull();
  });

  it('requireUser -> UNAUTHORIZED throw', async () => {
    await expect(requireUser(makeClient(undefined, null))).rejects.toMatchObject({
      code: API_CODE.UNAUTHORIZED,
      meta: { appCode: AppCode.NOT_LOGIN },
    });
  });

  it('requireUser -> id 반환', async () => {
    const id = await requireUserId(makeClient({ id: 'abc' } as any));
    expect(id).toBe('abc');
  });

  it('withAuth -> user를 주입해 fn 실행', async () => {
    const fn = withAuth(async (_client: any, user: any) => user.id);
    const id = await fn(makeClient({ id: 'xyz' } as any));
    expect(id).toBe('xyz');
  });
});
