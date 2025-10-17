// // useUpdateProgress.test.ts
// import { HotUpdater } from '@hot-updater/react-native';
// import { act, renderHook } from '@testing-library/react-hooks';

// import { useUpdateProgress } from './useUpdateProgress';

// describe('useUpdateProgress 훅 테스트', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('시나리오 1: 적용할 업데이트가 없으면, onUpdateProcessFinished 콜백을 호출해야 한다.', async () => {
//     // 1. Jest가 시간을 제어하도록 설정
//     jest.useFakeTimers();

//     (HotUpdater.checkForUpdate as jest.Mock).mockResolvedValue(null);
//     const onFinishedCallback = jest.fn();

//     await act(async () => {
//       renderHook(() => useUpdateProgress(onFinishedCallback));
//     });

//     // 2. 대기 중인 모든 타이머(setTimeout)를 즉시 실행
//     act(() => {
//       jest.runAllTimers();
//     });

//     expect(onFinishedCallback).toHaveBeenCalledTimes(1);
//     expect(HotUpdater.reload).not.toHaveBeenCalled();

//     // 3. 타이머 설정을 원래대로 복구
//     jest.useRealTimers();
//   });

//   test('시나리오 2: 적용할 업데이트가 있으면, HotUpdater.reload를 호출해야 한다.', async () => {
//     jest.useFakeTimers();
//     const fakeUpdate = { id: 'v2', fileUrl: 'some-url', status: 'available' };
//     (HotUpdater.checkForUpdate as jest.Mock).mockResolvedValue(fakeUpdate);
//     (HotUpdater.updateBundle as jest.Mock).mockResolvedValue(undefined);
//     const onFinishedCallback = jest.fn();

//     await act(async () => {
//       renderHook(() => useUpdateProgress(onFinishedCallback));
//     });

//     act(() => {
//       jest.runAllTimers();
//     });

//     expect(onFinishedCallback).not.toHaveBeenCalled();
//     expect(HotUpdater.reload).toHaveBeenCalledTimes(1);
//     jest.useRealTimers();
//   });

//   test('시나리오 3: 업데이트 확인 중 에러가 발생하면, onUpdateProcessFinished 콜백을 호출해야 한다.', async () => {
//     // 1. Jest가 시간을 제어하도록 설정
//     jest.useFakeTimers();

//     (HotUpdater.checkForUpdate as jest.Mock).mockRejectedValue(new Error('Network Error'));
//     const onFinishedCallback = jest.fn();

//     await act(async () => {
//       renderHook(() => useUpdateProgress(onFinishedCallback));
//     });

//     // 2. 대기 중인 모든 타이머(setTimeout)를 즉시 실행
//     act(() => {
//       jest.runAllTimers();
//     });

//     expect(onFinishedCallback).toHaveBeenCalledTimes(1);
//     expect(HotUpdater.reload).not.toHaveBeenCalled();

//     // 3. 타이머 설정을 원래대로 복구
//     jest.useRealTimers();
//   });
// });
