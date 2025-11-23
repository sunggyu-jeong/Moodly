import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { supabase } from '@/shared/lib/supabase.util';

const STORAGE_KEY = 'current_user_id.v1';

let cachedUserId: string | null = null;
let inflight: Promise<string> | null = null;
let authUnsubscribe: (() => void) | null = null;
let subscribed = false;

export class AuthRequiredError extends Error {
  code = 'UNAUTHORIZED' as const;

  constructor(message = '로그인이 필요합니다.') {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

type Listener = (userId: string | null) => void;
const listeners = new Set<Listener>();

const emit = (userId: string | null): void => {
  listeners.forEach(fn => fn(userId));
};

export const subscribeUserId = (fn: Listener): (() => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const persist = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, userId);
  } catch {
    console.log('>>>>>> 스토리지 저장 요청이 실패했습니다.');
  }
};

const readPersisted = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const fetchAndCache = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log('[fetchAndCache] getUser error =', error);

    const userId = data?.user?.id;

    if (error || !userId) {
      cachedUserId = null;
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.log('>>>>', err);
      }
      emit(null);
      throw new AuthRequiredError();
    }

    cachedUserId = userId;
    await persist(userId);
    emit(userId);
    return userId;
  } finally {
    inflight = null;
  }
};

export const initUserId = async (): Promise<string | null> => {
  await clearUserIdCache();
  const persisted = await readPersisted();

  if (persisted) {
    cachedUserId = persisted;
    if (!inflight)
      inflight = fetchAndCache().catch(err => {
        console.log('[initUserId] background sync error =', err);
        return persisted;
      });
    return persisted;
  }

  try {
    if (!inflight) inflight = fetchAndCache();
    return await inflight;
  } catch (e) {
    if (e instanceof AuthRequiredError) {
      return null;
    }
    throw e;
  }
};

export const getUserIdSync = (): string | null => cachedUserId;

export const getUserId = async (): Promise<string> => {
  if (cachedUserId) return cachedUserId;
  if (!inflight) inflight = fetchAndCache();
  return inflight;
};

export const clearUserIdCache = async (): Promise<void> => {
  cachedUserId = null;
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.log('>>>>', err);
  }
  emit(null);
};

export const subscribeAuthChanges = (): void => {
  if (subscribed) return;
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const next = session?.user?.id ?? null;

    if (next !== cachedUserId) {
      cachedUserId = next;
      try {
        if (next) {
          await AsyncStorage.setItem(STORAGE_KEY, next);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.log('>>>>', err);
      }
      emit(next);
    }
  });
  authUnsubscribe = () => subscription.unsubscribe();
  subscribed = true;
};

export const unsubscribeAuthChanges = (): void => {
  authUnsubscribe?.();
  authUnsubscribe = null;
  subscribed = false;
};

export const isIphone = () => Platform.OS === 'ios';
