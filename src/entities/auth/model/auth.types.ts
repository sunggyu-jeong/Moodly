import type { User } from '@supabase/supabase-js';

type UserProps =
  | 'id'
  | 'email'
  | 'phone'
  | 'user_metadata'
  | 'app_metadata'
  | 'created_at'
  | 'updated_at';

export type AuthUser = Pick<User, UserProps>;

export type AuthSession = {
  user: AuthUser | null;
  access_token?: string | null;
  expires_at?: number | null;
};

export type SignInPasswordInput = { email: string; password: string };
export type SignUpPasswordInput = {
  email: string;
  password: string;
  data?: Record<string, unknown>;
};

export type UserInfo = {
  id: string;
  nickname: string;
  email: string;
};

export type SignInProvider = 'google' | 'apple';

export interface SignInProviderInput {
  provider: SignInProvider;
}

export interface SetUserInfoInput {
  nickname: string;
}
