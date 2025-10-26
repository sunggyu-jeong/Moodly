// src/shared/config/env.ts
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

type Extra = {
  APP_ENV: '' | 'develop' | 'staging' | 'production';
  KAKAO_OPEN_CHAT_LINK: string;
  PRIVACY_POLICY_LINK: string;
  TERMS_OF_SERVICE_LINK: string;
  HOT_UPDATER_SUPABASE_ANON_KEY: string;
  HOT_UPDATER_SUPABASE_URL: string;
  GOOGLE_WEB_CLIENT_ID: string;
  AMPLITUDE_API_KEY: string;
  ENCRYPTION_SECRET_KEY: string;
};

const KEYS = [
  'APP_ENV',
  'KAKAO_OPEN_CHAT_LINK',
  'PRIVACY_POLICY_LINK',
  'TERMS_OF_SERVICE_LINK',
  'HOT_UPDATER_SUPABASE_ANON_KEY',
  'HOT_UPDATER_SUPABASE_URL',
  'GOOGLE_WEB_CLIENT_ID',
  'AMPLITUDE_API_KEY',
  'ENCRYPTION_SECRET_KEY',
] as const;

function getUpdatesExtra<T extends object = Record<string, unknown>>(): Partial<T> {
  const m = Updates.manifest as unknown as { extra?: T } | null;
  return (m?.extra ?? {}) as Partial<T>;
}

function fillEmpty<T extends Record<string, any>, K extends readonly (keyof T)[]>(
  merged: Partial<T>,
  keys: K
): T {
  const out = {} as T;
  for (const k of keys) {
    const v = merged[k];
    (out as any)[k] = (v ?? '') as T[typeof k];
  }
  return out;
}

export function getExtra(): Extra {
  const fromConstants = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;
  const fromUpdates = getUpdatesExtra<Extra>();
  const merged = { ...fromUpdates, ...fromConstants };
  return fillEmpty<Extra, typeof KEYS>(merged, KEYS);
}

export const ENV = getExtra();