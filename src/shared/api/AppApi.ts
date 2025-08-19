import { createApi } from '@reduxjs/toolkit/query/react';

import { supabaseBaseQuery } from './SupabaseBaseQuery';
import { TAGS } from './TagTypes';

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: [...TAGS],
  endpoints: () => ({}),
});
