import { View } from 'react-native';

import { gray } from '@/shared/styles/colors';
import { Body1 } from '@/shared/ui/typography/Body1';

type KeywordItem = {
  title: string;
  message: string;
};

type KeywordItemProps = {
  items: KeywordItem[];
};

export const CoreKeywordsList = ({ items }: KeywordItemProps) => {
  return (
    <View>
      {items.map((el, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <View
            key={idx}
            style={{ gap: 2, marginBottom: isLast ? 0 : 16 }}
          >
            <Body1
              weight="semibold"
              style={{ color: gray[500], lineHeight: 28 }}
            >
              {el.title}
            </Body1>
            <Body1
              weight="regular"
              style={{ color: gray[500], lineHeight: 28 }}
            >
              {el.message}
            </Body1>
          </View>
        );
      })}
    </View>
  );
};
