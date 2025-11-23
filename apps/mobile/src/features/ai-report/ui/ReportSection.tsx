import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { gray } from '@/shared/styles/colors';
import SectionCard from '@/shared/ui/elements/SectionCard';
import { H3 } from '@/shared/ui/typography/H3';

export const ReportSection = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <View style={styles.wrap}>
      <H3
        weight="semibold"
        style={styles.title}
      >
        {title}
      </H3>
      <SectionCard>{children}</SectionCard>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    backgroundColor: gray[50],
    // elevation: 2,
  },
  title: { color: gray[500] },
});
