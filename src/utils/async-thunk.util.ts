import { AsyncStatus } from "../constant/ApiStatus";
import { PayloadAction } from "@reduxjs/toolkit";

/**
 * 제네릭 상태 S에 대해 AsyncThunk의 pending, fulfilled, rejected 케이스를 추가하는 헬퍼 함수
 *
 * @template T - thunk가 반환하는 payload 타입
 * @template S - 상태 객체의 타입
 * @param builder - createSlice의 extraReducers builder
 * @param thunk - 처리할 async thunk
 * @param statusKey - 상태 객체 S 내에서 상태 값을 저장할 key (AsyncStatusType)
 * @param errorKey - 상태 객체 S 내에서 에러 메시지를 저장할 key (string | null)
 * @param onFulfilled - fulfilled 케이스 시 추가 처리 함수 (선택 사항)
 * @param defaultErrorMessage - rejected 케이스의 기본 에러 메시지 (선택 사항)
 */
export function addAsyncThunkCase<T, S>(
  builder: any,
  thunk: any,
  statusKey: keyof S,
  errorKey: keyof S,
  defaultErrorMessage?: string,
  onFulfilled?: (state: S, action: PayloadAction<T>) => void
) {
  builder.addCase(thunk.pending, (state: S) => {
    (state as any)[statusKey].status = AsyncStatus.Pending;
    (state as any)[errorKey].error = null;
  });

  builder.addCase(thunk.fulfilled, (state: S, action: PayloadAction<T>) => {
    (state as any)[statusKey].status = AsyncStatus.Succeeded;
    if (onFulfilled) {
      onFulfilled(state, action);
    } else {
      (state as any)[statusKey].data = action.payload;
    }
  });

  builder.addCase(thunk.rejected, (state: S, action: PayloadAction<T>) => {
    (state as any)[statusKey].status = AsyncStatus.Failed;
    (state as any)[errorKey].error = action.payload || defaultErrorMessage;
  });
}