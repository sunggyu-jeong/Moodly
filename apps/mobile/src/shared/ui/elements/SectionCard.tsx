import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SectionCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: 20,
  },
});
