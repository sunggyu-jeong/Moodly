import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface ProgressProps {
  value: number;
  style?: StyleProp<ViewStyle>;
}

const Progress = ({ value, style }: ProgressProps) => {
  return (
    <View
      role="progressbar"
      aria-valuenow={value}
      style={[styles.container, style]}
    >
      <View style={[styles.bar, { width: `${value}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
  },
});

export default Progress;
