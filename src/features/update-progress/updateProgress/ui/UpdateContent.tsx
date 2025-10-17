import Progress from '@/shared/ui/elements/Progress';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export interface UpdateContentProps {
  title: string;
  subtitle?: string;
  progress: number;
  progressLabel: string;
}

const UpdateContent = ({ title, subtitle, progress, progressLabel }: UpdateContentProps) => {
  const showPercent = !!progressLabel;

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  return (
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
          <Text className="text-common-white/90 text-base">{progressLabel}</Text>
          {showPercent && (
            <Text className="text-common-white/90 text-base">{Math.round(progress)}%</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default UpdateContent;
