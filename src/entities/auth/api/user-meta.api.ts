import AsyncStorage from '@react-native-async-storage/async-storage';
import { appApi } from '@/shared/api/AppApi';
import { toAppError } from '@/shared/api/Error';

const IS_FIRST_LAUNCH_KEY = '@userMeta:isFirstLoad';

export const userMetaApi = appApi.injectEndpoints({
  endpoints: builder => ({
    getFirstLaunchFlag: builder.query<boolean, void>({
      queryFn: async () => {
        try {
          const storedValue = await AsyncStorage.getItem(IS_FIRST_LAUNCH_KEY);

          if (storedValue === null) {
            return { data: true };
          }
          const isFirstLoad = JSON.parse(storedValue);
          return { data: isFirstLoad };
        } catch (err) {
          return { error: toAppError(err) };
        }
      },
      providesTags: ['UserMeta'],
    }),

    updateFirstLaunchFlag: builder.mutation<boolean, { isFirstLoad: boolean }>({
      queryFn: async ({ isFirstLoad }) => {
        try {
          const valueToStore = JSON.stringify(isFirstLoad);
          await AsyncStorage.setItem(IS_FIRST_LAUNCH_KEY, valueToStore);
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
