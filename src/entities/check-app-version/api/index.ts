import type { SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { AppPlatform, VersionPolicy } from '@/entities/app/model/types';
import { appApi } from '@/shared/api/appApi';

const versionApi = appApi.injectEndpoints({
  endpoints: builder => ({
    getAppVersionPolicy: builder.query<VersionPolicy | null, void>({
      query: () => async (client: SupabaseClient) => {
        const platform: AppPlatform = Platform.OS === 'android' ? 'aos' : 'ios';
        const { data, error } = await client.rpc('get_version_policy', { p_platform: platform });
        if (error) throw error;
        return (data as VersionPolicy[] | null)?.[0] ?? null;
      },
      providesTags: r => (r ? [{ type: 'VersionPolicy', id: 'SINGLE' }] : []),
    }),
  }),
});

export const { useGetAppVersionPolicyQuery } = versionApi;
