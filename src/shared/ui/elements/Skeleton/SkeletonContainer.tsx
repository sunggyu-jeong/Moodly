import { MotiView } from 'moti';
import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { gray } from '@/shared/styles/colors';

type SkeletonContainerProps = ComponentProps<typeof MotiView>;

const SkeletonContainer = ({ children, ...props }: SkeletonContainerProps) => (
  <MotiView
    transition={{ type: 'timing', duration: 700 }}
    from={{ backgroundColor: '#E5E7EB' }}
    animate={{ backgroundColor: '#FFFFFF' }}
    style={styles.container}
    {...props}
  >
    {children}
  </MotiView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: gray[400],
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default SkeletonContainer;
