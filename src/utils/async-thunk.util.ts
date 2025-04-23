import { ActionReducerMapBuilder, AsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AsyncStatus } from '../constant/ApiStatus';

interface AsyncThunkProps<T, S> {
  builder: ActionReducerMapBuilder<S>;
  thunk: AsyncThunk<T, any, { rejectValue: any }>;
  key: keyof S;
  defaultErrorMessage?: string;
  onFulfilled?: (state: S, action: PayloadAction<T>) => void;
}

/**
 * 제네릭 상태 S에 대해 AsyncThunk의 pending, fulfilled, rejected 케이스를 추가하는 헬퍼 함수
 *
 * @template T - thunk가 반환하는 payload 타입
 * @template S - 상태 객체의 타입
 * @param builder - createSlice의 extraReducers builder
 * @param thunk - 처리할 async thunk
 * @param key - 상태 객체 S 내에서 상태 값을 저장할 key (AsyncStatusType)
 * @param onFulfilled - fulfilled 케이스 시 추가 처리 함수 (선택 사항)
 * @param defaultErrorMessage - rejected 케이스의 기본 에러 메시지 (선택 사항)
 */
export function addAsyncThunkCase<T, S>({ ...props }: AsyncThunkProps<T, S>) {
  props.builder.addCase(props.thunk.pending, (state) => {
    (state as any)[props.key].status = AsyncStatus.Pending;
    (state as any)[props.key].error = null;
  });

  props.builder.addCase(props.thunk.fulfilled, (state, action) => {
    (state as any)[props.key].status = AsyncStatus.Succeeded;
    if (props.onFulfilled) {
      props.onFulfilled(state as S, action);
    } else {
      (state as any)[props.key].data = action.payload;
    }
  });

  props.builder.addCase(props.thunk.rejected, (state, action) => {
    (state as any)[props.key].status = AsyncStatus.Failed;
    (state as any)[props.key].error = action.payload || props.defaultErrorMessage;
  });
}
