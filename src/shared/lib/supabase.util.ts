import { store } from '@/app/store';
import { HOT_UPDATER_SUPABASE_ANON_KEY, HOT_UPDATER_SUPABASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { resetAuthState } from '../../features/auth/model/auth.slice';
import { resetTo } from './navigation.util';

export const supabase = createClient(HOT_UPDATER_SUPABASE_URL, HOT_UPDATER_SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: async (input, init) => {
      const res = await fetch(input, init);
      if (res.status === 401 || res.status === 403) {
        store.dispatch(resetAuthState());
        resetTo('Login');
        throw new Error('인증이 만료되었습니다. 다시 로그인하세요.');
      }
      return res;
    },
  },
});
