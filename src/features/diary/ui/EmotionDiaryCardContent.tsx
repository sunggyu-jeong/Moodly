import { StyleSheet } from 'react-native';

import { gray } from '@shared/styles/colors.ts';
import { Body2 } from '@shared/ui/typography/Body2.tsx';

export interface DiaryCardContentProps {
  content: string;
}

const EmotionDiaryCardContent = ({ content }: DiaryCardContentProps) => {
  return (
    <Body2
      weight="regular"
      style={styles.textStyle}
    >
      {content}
    </Body2>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: gray[600],
  },
});

export default EmotionDiaryCardContent;
