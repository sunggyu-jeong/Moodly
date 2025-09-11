// Supabase 클라이언트 타입 (프로젝트에 맞게 경로 수정 필요)
import type { SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { AppPlatform, VersionPolicy } from '@/entities/app/model/types';
import { appApi } from '@/shared/api/AppApi';

const versionApi = appApi.injectEndpoints({
  endpoints: builder => ({
    getAppVersionPolicy: builder.query<VersionPolicy | null, void>({
      query: () => async (client: SupabaseClient) => {
        const platform: AppPlatform = Platform.OS === 'android' ? 'aos' : 'ios';

        const { data, error } = await client.rpc('get_version_policy', {
          p_platform: platform,
        });

        if (error) {
          return { data: null, error };
        }

        return { data: (data as VersionPolicy[] | null)?.[0] || null, error: null };
      },
      providesTags: result => (result ? [{ type: 'VersionPolicy', id: 'SINGLE' }] : []),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAppVersionPolicyQuery } = versionApi;
