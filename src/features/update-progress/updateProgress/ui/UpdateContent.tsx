import type {
  UpdateProgressMent,
  UpdateProgressStatus,
} from '@app/navigation/hooks/useUpdateProgress';
import Progress from '@shared/ui/elements/Progress';
import { Text, View } from 'react-native';

export interface UpdateContentProps {
  progress: number;
  status: UpdateProgressStatus;
  ment: UpdateProgressMent;
}

const UPDATE_LABELS: Record<UpdateProgressStatus, { title: string; subtitle?: string }> = {
  UPDATE_CHECKING: {
    title: '새 버전이 있는지 확인 중…',
    subtitle: '잠깐만 기다려 주세요.',
  },
  UPDATE_IN_PROGRESS: {
    title: '앱을 업데이트하는 중이에요.',
  },
  UPDATE_PROCESS_COMPLETED: {
    title: '앱이 최신 상태예요!',
  },
  UPDATE_ERROR: {
    title: '오류가 발생했어요.',
    subtitle: '앱을 다시 시작해주세요.',
  },
};

const UpdateContent = ({ progress, status, ment }: UpdateContentProps) => {
  const isLatest = status === 'UPDATE_PROCESS_COMPLETED';
  const showStatusUI = !isLatest;
  const showPercent = status === 'UPDATE_IN_PROGRESS';

  const { title, subtitle } = UPDATE_LABELS[status] || {};

  return showStatusUI ? (
    <View className="w-full max-w-xs my-6 space-y-6">
      <View className="items-center mb-4 space-y-1">
        <Text className="text-common-white text-lg font-semibold">{title}</Text>
        {subtitle && <Text className="text-common-white/80 text-sm">{subtitle}</Text>}
      </View>

      <View className="space-y-3">
        <Progress
          value={progress}
          className="w-full h-2 bg-common-white/20"
        />
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-common-white/90 text-base">{ment}</Text>
          {showPercent && (
            <Text className="text-common-white/90 text-base">{Math.round(progress)}%</Text>
          )}
        </View>
      </View>
    </View>
  ) : null;
};

export default UpdateContent;
