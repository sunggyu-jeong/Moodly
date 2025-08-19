import { type UpdateProgressProps, useUpdateProgress } from '@processes/update/useUpdateProgress';
import Progress from '@shared/ui/elements/Progress';
import { Text, View } from 'react-native';

const UPDATE_LABELS: Record<string, { title: string; subtitle?: string }> = {
  CHECK_FOR_UPDATE: {
    title: '새 버전이 있는지 확인 중…',
    subtitle: '잠깐만 기다려 주세요.',
  },
  UPDATING: {
    title: '앱을 업데이트하는 중이에요.',
  },
  UPDATE_PROCESS_COMPLETED: {
    title: '앱이 최신 상태예요!',
  },
};

const UpdateContent = ({ progress, status }: UpdateProgressProps) => {
  const { progressMent } = useUpdateProgress({ progress });

  const { title, subtitle } = UPDATE_LABELS[status];

  return (
    <View className="w-full max-w-xs my-6 space-y-6">
      {/* 헤더 */}
      <View className="items-center mb-4 space-y-1">
        <Text className="text-common-white text-lg font-semibold">{title}</Text>
        {subtitle && <Text className="text-common-white/80 text-sm">{subtitle}</Text>}
      </View>

      {/* 업데이트 중일 때만 프로그레스 바 표출 */}
      {status === 'UPDATING' && (
        <View className="space-y-3">
          <Progress
            value={progress}
            className="w-full h-2 bg-common-white/20"
          />
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-common-white/90 text-base">{progressMent}</Text>
            <Text className="text-common-white/90 text-base">{Math.round(progress)}%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default UpdateContent;
