// Supabase 클라이언트 타입 (프로젝트에 맞게 경로 수정 필요)
import type { SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { AppPlatform, VersionPolicy } from '@/entities/app/model/types';
import { appApi } from '@/shared/api/AppApi';
import { TAGS } from '@/shared/api/TagTypes';

const versionApi = appApi.injectEndpoints({
  endpoints: builder => ({
    // RPC 결과가 없을 수도 있으므로 반환 타입을 VersionPolicy | null로 지정
    getAppVersionPolicy: builder.query<VersionPolicy | null, void>({
      // `query`가 Supabase 클라이언트를 받는 함수를 반환하도록 수정합니다.
      // 이것이 사용자의 기존 패턴과 일치하며, `rpcName` 오류를 해결합니다.
      query: () => async (client: SupabaseClient) => {
        const platform: AppPlatform = Platform.OS === 'android' ? 'aos' : 'ios';

        const { data, error } = await client.rpc('get_version_policy', {
          p_platform: platform,
        });

        if (error) {
          return { error };
        }
        return { data: data?.[0] || null };
      },
      providesTags: result => (result ? [TAGS.VersionPolicy] : []),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAppVersionPolicyQuery } = versionApi;
