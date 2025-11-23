import React from 'react';
import { View, ViewStyle } from 'react-native';

import { splitToParagraphs } from '@/entities/ai-report/lib/splitToParagraphs';
import { gray } from '@/shared/styles/colors';
import { Body1 } from '@/shared/ui/typography/Body1';

type Props = {
  text: string;
  style?: ViewStyle;
};

export const FormattedTextSection: React.FC<Props> = ({ text, style }) => {
  const paragraphs = splitToParagraphs(text);

  return (
    <View style={style}>
      {paragraphs.map((paragraph, idx) => (
        <Body1
          key={idx}
          weight="regular"
          style={{
            color: gray[500],
            lineHeight: 28,
            marginBottom: idx === paragraphs.length - 1 ? 0 : 14,
          }}
        >
          {paragraph}
        </Body1>
      ))}
    </View>
  );
};
