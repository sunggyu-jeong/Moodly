// src/features/user-meta/api/userMetaApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

import { appApi } from '@/shared/api/appApi';
import { toAppError } from '@/shared/api/error/mapper';

const IS_FIRST_LAUNCH_KEY = '@userMeta:isFirstLoad';

export const userMetaApi = appApi.injectEndpoints({
  endpoints: builder => ({
    getFirstLaunchFlag: builder.query<boolean, void>({
      queryFn: async () => {
        try {
          const stored = await AsyncStorage.getItem(IS_FIRST_LAUNCH_KEY);
          if (stored === null) return { data: true };
          return { data: JSON.parse(stored) };
        } catch (err) {
          return { error: toAppError(err) };
        }
      },
      providesTags: ['UserMeta'],
    }),

    updateFirstLaunchFlag: builder.mutation<boolean, { isFirstLoad: boolean }>({
      queryFn: async ({ isFirstLoad }) => {
        try {
          await AsyncStorage.setItem(IS_FIRST_LAUNCH_KEY, JSON.stringify(isFirstLoad));
          return { data: true };
        } catch (err) {
          return { error: toAppError(err) };
        }
      },
      invalidatesTags: ['UserMeta'],
    }),
  }),
});

export const { useLazyGetFirstLaunchFlagQuery, useUpdateFirstLaunchFlagMutation } = userMetaApi;
