import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { supabase } from '@/shared/lib/supabase.util';

const STORAGE_KEY = 'current_user_id.v1';

let cachedUserId: string | null = null;
let inflight: Promise<string> | null = null;
let authUnsubscribe: (() => void) | null = null;
let subscribed = false;

type Listener = (userId: string) => void;
const listeners = new Set<Listener>();

const emit = (userId: string): void => {
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
    console.log('>>>>>> 스토리 저장 요청이 실패했습니다.');
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
    const userId = error ? 'local' : (data.user?.id ?? 'local');
    cachedUserId = userId;
    await persist(userId);
    emit(userId);
    return userId;
  } finally {
    inflight = null;
  }
};

export const initUserId = async (): Promise<string> => {
  await clearUserIdCache();
  const persisted = await readPersisted();
  if (persisted) {
    cachedUserId = persisted;
    // 백그라운드 동기화(대기하지 않음)
    if (!inflight) inflight = fetchAndCache();
    return persisted;
  }
  if (!inflight) inflight = fetchAndCache();
  return inflight;
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
  } catch {
    // 무시
  }
  emit('local');
};

export const subscribeAuthChanges = (): void => {
  if (subscribed) return;
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const next = session?.user?.id ?? 'local';
    if (next !== cachedUserId) {
      cachedUserId = next;
      await AsyncStorage.setItem('current_user_id.v1', next);
      listeners.forEach(fn => fn(next));
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
