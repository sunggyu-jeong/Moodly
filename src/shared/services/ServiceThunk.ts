import { createAsyncThunk } from '@reduxjs/toolkit';

interface ServiceThunkOptions<Returned, ThunkArg> {
  onSuccess?: (result: Returned, arg: ThunkArg) => void | Promise<void>;
  onError?: (error: unknown, arg: ThunkArg) => void | Promise<void>;
}

export function createServiceThunk<Returned, ThunkArg>(
  type: string,
  serviceFn: (arg: ThunkArg) => Promise<Returned>,
  options: ServiceThunkOptions<Returned, ThunkArg> = {},
) {
  return createAsyncThunk<Returned, ThunkArg>(type, async (arg, { rejectWithValue }) => {
    try {
      const result = await serviceFn(arg);
      if (options.onSuccess) {
        await options.onSuccess(result, arg);
      }
      return result;
    } catch (error: unknown) {
      if (options.onError) {
        await options.onError(error, arg);
      }
      return rejectWithValue(
        error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
      );
    }
  });
}
