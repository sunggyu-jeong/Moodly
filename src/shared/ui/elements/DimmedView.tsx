import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface DimmedViewProps {
  children: ReactNode;
  onPress?: () => void;
}

const DimmedView = ({ children, onPress }: DimmedViewProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.touchArea}
    >
      <View style={styles.dimmedBackground}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    flex: 1,
  },
  dimmedBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default DimmedView;
