import { StyleSheet, Text, View } from 'react-native';

export default function KeywordsList({ items }: { items: string[] }) {
  return (
    <View style={styles.wrap}>
      {items.map((it, idx) => (
        <View
          key={`${it}-${idx}`}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F4F6FA',
  },
  chipText: { color: '#334155' },
});
