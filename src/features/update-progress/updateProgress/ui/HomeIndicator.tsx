import { StyleSheet, View } from 'react-native';

export default function HomeIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: [{ translateX: -64 }],
  },
  bar: {
    width: 128,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 9999,
  },
});
