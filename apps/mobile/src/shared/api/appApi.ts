import { createApi } from '@reduxjs/toolkit/query/react';

import { supabaseBaseQuery } from '@/shared/api/supabaseBaseQuery';
import { TAGS } from '@/shared/api/tagTypes';
import { supabase } from '@/shared/lib/supabase.util';

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: supabaseBaseQuery(supabase),
  tagTypes: [...TAGS],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
});
