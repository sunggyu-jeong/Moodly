import { MotiView } from 'moti';
import type { ComponentProps } from 'react';

type SkeletonContainerProps = ComponentProps<typeof MotiView>;

const SkeletonContainer = ({ children, ...props }: SkeletonContainerProps) => {
  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      animate={{ backgroundColor: '#ffffff' }}
      className="bg-gray-400 rounded-xl"
      {...props}
    >
      {children}
    </MotiView>
  );
};

export default SkeletonContainer;
