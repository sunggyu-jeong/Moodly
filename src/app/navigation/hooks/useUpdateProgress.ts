import { HOT_UPDATER_SUPABASE_URL } from '@env';
// import { HotUpdater } from '@hot-updater/react-native';
import { useEffect, useRef, useState } from 'react';

export type UpdateProgressStatus =
  | 'UPDATE_CHECKING'
  | 'UPDATE_IN_PROGRESS'
  | 'UPDATE_PROCESS_COMPLETED'
  | 'UPDATE_ERROR';

export type UpdateProgressMent =
  | '업데이트를 확인하고 있습니다.'
  | '업데이트 중...'
  | '업데이트가 완료되었습니다.'
  | '오류가 발생했습니다.'
  | '업데이트가 완료되었습니다. 앱을 재시작합니다.';

export const useUpdateProgress = (onUpdateProcessFinished: () => void) => {
  const [status, setStatus] = useState<UpdateProgressStatus>('UPDATE_CHECKING');
  const [progress, setProgress] = useState(0);
  const [ment, setMent] = useState<UpdateProgressMent>('업데이트를 확인하고 있습니다.');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    const updateSourceUrl = `${HOT_UPDATER_SUPABASE_URL}/functions/v1/update-server`;

    const finishProcess = () => {
      if (isMounted) {
        setStatus('UPDATE_PROCESS_COMPLETED');
        setMent('업데이트가 완료되었습니다.');
        setProgress(100);
        // 0.5초 후 콜백을 실행하여 네비게이션 로직 시작
        setTimeout(onUpdateProcessFinished, 500);
      }
    };

    const runUpdate = async () => {
      try {
        if (!isMounted) return;

        setStatus('UPDATE_CHECKING');
        setMent('업데이트를 확인하고 있습니다.');
        setProgress(10);

        // const update = await HotUpdater.checkForUpdate({
        //   source: updateSourceUrl,
        // });

        // if (!update) {
        //   finishProcess();
        //   return;
        // }

        // if (isMounted) {
        //   setStatus('UPDATE_IN_PROGRESS');
        //   setMent('업데이트 중...');
        // }

        // intervalRef.current = setInterval(() => {
        //   setProgress(prev => {
        //     if (prev >= 95) {
        //       if (intervalRef.current) clearInterval(intervalRef.current);
        //       return 95;
        //     }
        //     return prev + 1;
        //   });
        // }, 50);

        // // 실제 번들 파일 다운로드 및 적용
        // await HotUpdater.updateBundle({
        //   bundleId: update.id,
        //   fileUrl: update.fileUrl,
        //   status: update.status,
        // });

        // if (intervalRef.current) clearInterval(intervalRef.current);

        // if (isMounted) {
        //   setProgress(100);
        //   setMent('업데이트가 완료되었습니다. 앱을 재시작합니다.');
        // }

        // setTimeout(() => {
        //   HotUpdater.reload();
        // }, 1000);
      } catch (error) {
        console.log('>>> Hot update error:', error);
        if (intervalRef.current) clearInterval(intervalRef.current);
        finishProcess();
      }
    };

    runUpdate();

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onUpdateProcessFinished]);

  return { status, progress, ment };
};
