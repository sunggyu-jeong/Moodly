import { Image, StyleSheet, View } from 'react-native';

import type { AIReportGeneratingProps } from '@/features/ai-report/model/types';
import { AI_ICONS } from '@/shared/assets/images/ai-report';
import { gray } from '@/shared/styles/colors';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';

const AIReportGenerating = ({ nickname, isLoading }: AIReportGeneratingProps) => {
  console.log('isLoading:', isLoading);
  return (
    <View style={styles.container}>
      <Image
        source={AI_ICONS.iconAvatarWrite}
        style={styles.writeImage}
        accessibilityLabel="AI 작성중"
      />
      <H2
        weight="semibold"
        style={styles.title}
      >
        리포트를 작성하고 있어요
      </H2>
      <Body2
        weight="regular"
        style={styles.ment}
      >
        {(nickname ?? '무들리') + '님의 지난 일주일을 돌아보고 있어요..'}
      </Body2>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
  },
  writeImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    color: gray[600],
    textAlign: 'center',
  },
  ment: {
    color: gray[400],
    textAlign: 'center',
  },
});

export default AIReportGenerating;
