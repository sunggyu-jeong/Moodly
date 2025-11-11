import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/shared/api/error/appError';
import { toAppError } from '@/shared/api/error/mapper';

type SupaResult<T> = { data: T | null; error: unknown | null; status?: number };
export type SupabaseHandler<T> =
  | ((client: SupabaseClient) => Promise<SupaResult<T>>)
  | ((client: SupabaseClient) => Promise<T>);

export const supabaseBaseQuery =
  (client: SupabaseClient): BaseQueryFn<SupabaseHandler<unknown>, unknown, AppError> =>
  async handler => {
    try {
      const r = await (handler as any)(client);

      if (r && typeof r === 'object' && 'data' in r && 'error' in r) {
        const { data, error } = r as SupaResult<unknown>;
        if (error) return { error: toAppError(error) };
        return { data };
      }
      return { data: r as unknown };
    } catch (e) {
      return { error: toAppError(e) };
    }
  };
