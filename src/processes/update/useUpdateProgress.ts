import { useEffect, useState } from 'react';

type UpdateStepType = 'CHECK_FOR_UPDATE' | 'UPDATING' | 'UPDATE_PROCESS_COMPLETED';

export interface UpdateProgressProps {
  status: UpdateStepType;
  progress: number;
}

export function useUpdateProgress({ progress }: Pick<UpdateProgressProps, 'progress'>) {
  const [progressMent, setProgressMent] = useState('업데이트 내용을 확인하고 있습니다.');

  useEffect(() => {
    if (progress === 0) {
      setProgressMent('업데이트 내용을 확인하고 있습니다.');
    } else if (progress < 20) {
      setProgressMent('다운로드 중...');
    } else if (progress < 40) {
      setProgressMent('데이터 처리 중...');
    } else if (progress < 60) {
      setProgressMent('설정 적용 중...');
    } else if (progress < 80) {
      setProgressMent('마무리 작업 중...');
    } else if (progress < 100) {
      setProgressMent('완료 준비 중...');
    } else {
      setProgressMent('업데이트 완료!');
    }
  }, [progress]);

  return {
    progressMent,
  };
}
