import { View } from 'react-native';

import { gray } from '@/shared/styles/colors';
import { Body1 } from '@/shared/ui/typography/Body1';

type ReflectionProps = {
  questions: string[];
};
export const ReflectionList = ({ questions }: ReflectionProps) => {
  return (
    <View>
      {questions.map((question, idx) => {
        const isLast = idx === questions.length - 1;
        return (
          <View
            key={idx}
            style={{ marginBottom: isLast ? 0 : 14 }}
          >
            <Body1
              weight="regular"
              style={{ color: gray[500], lineHeight: 28 }}
            >
              {`· ${question}`}
            </Body1>
          </View>
        );
      })}
    </View>
  );
};
