import { AuthError, Session } from '@supabase/supabase-js';

export type ApiResponse<T> = {
  session: Session | null;
  data: T | null;
  error: AuthError | null;
};
