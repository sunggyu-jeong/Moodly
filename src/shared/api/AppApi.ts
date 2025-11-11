import { createApi } from '@reduxjs/toolkit/query/react';
import { createClient } from '@supabase/supabase-js';

import { ENV } from '@/shared/lib/env';

import { supabaseBaseQuery } from './supabaseBaseQuery';
import { TAGS } from './tagTypes';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: supabaseBaseQuery(supabase),
  tagTypes: [...TAGS],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
});
