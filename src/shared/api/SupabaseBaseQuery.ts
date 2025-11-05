import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { supabase } from '@/shared/lib/supabase.util';

import { type AppError, toAppError } from './Error';

interface SupabaseType<T> {
  data: T | null;
  error: unknown | null;
  status?: number;
}

export type SupabaseHandler<T> = (client: typeof supabase) => Promise<SupabaseType<T>>;

export const supabaseBaseQuery: BaseQueryFn<
  SupabaseHandler<unknown>,
  unknown,
  AppError
> = async handler => {
  try {
    const { data, error } = await handler(supabase);
    if (error) {
      return { error: toAppError(error) };
    }
    return { data: data as unknown };
  } catch (e) {
    return { error: toAppError(e) };
  }
};
