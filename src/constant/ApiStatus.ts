/**
 * 비동기 작업의 상태를 나타내는 객체
 * 각 상태 값은 문자열 리터럴로 정의되어 있다
 */
export const AsyncStatus = {
  Idle: 'idle',
  Pending: 'pending',
  Succeeded: 'succeeded',
  Failed: 'failed',
} as const;

/**
 * AsyncStatus 객체에서 가능한 상태 값들을 추출한 타입
 */
export type AsyncStatusType = typeof AsyncStatus[keyof typeof AsyncStatus];

/**
 * 비동기 작업의 초기 상태
 * 상태와 에러 필드, 데이터를 포함한다
 *
 * @example
 * const myAsyncState: AsyncOperationState = {
 *   status: AsyncStatus.Idle,
 *   error: null,
 * };
 */
export const createInitialAsyncState = <T>(initialData?: T): AsyncOperationState<T> => ({
  status: AsyncStatus.Idle,
  error: null,
  data: initialData,
});

/**
 * 비동기 작업의 상태를 나타내는 인터페이스
 * 이 인터페이스는 작업의 현재 상태와 에러 메시지를 관리한다
 */
export interface AsyncOperationState<T> {
  status: AsyncStatusType;
  error: string | null;
  data?: T;
}