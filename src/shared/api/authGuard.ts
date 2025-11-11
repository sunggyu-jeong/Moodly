import type { SupabaseClient, User } from '@supabase/supabase-js';

import { API_CODE, AppCode } from '@/shared/api/error/apiCode';

import { isEmpty } from './../lib/value.util';

const unauthenticated = () =>
  ({
    code: API_CODE.UNAUTHORIZED,
    message: '로그인이 필요합니다.',
    status: 401,
    meta: { appCode: AppCode.NOT_LOGIN },
  }) as const;

export const requireUser = async (client: SupabaseClient): Promise<User> => {
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  if (isEmpty(data?.user)) throw unauthenticated();
  return data.user;
};

export const requireUserId = async (client: SupabaseClient): Promise<string> => {
  const user = await requireUser(client);
  return user.id;
};

export const withAuth = <T>(fn: (client: SupabaseClient, user: User) => Promise<T>) => {
  return async (client: SupabaseClient) => {
    const user = await requireUser(client);
    return fn(client, user);
  };
};
