import Progress from '@/shared/ui/elements/Progress';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.progressWrapper}>
        <Progress
          value={progress}
          style={styles.progressBar}
        />
        <View style={styles.progressInfo}>
          <Text style={styles.label}>{progressLabel}</Text>
          {showPercent && <Text style={styles.label}>{Math.round(progress)}%</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    marginVertical: 24,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  progressWrapper: {
    gap: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
});

export default UpdateContent;
