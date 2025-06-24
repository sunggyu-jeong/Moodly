import { HOT_UPDATER_SUPABASE_ANON_KEY, HOT_UPDATER_SUPABASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(HOT_UPDATER_SUPABASE_URL, HOT_UPDATER_SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
