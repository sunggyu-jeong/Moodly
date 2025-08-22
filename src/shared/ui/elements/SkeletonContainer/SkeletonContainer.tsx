import { MotiView } from 'moti';
import type { ComponentProps } from 'react';

type SkeletonContainerProps = ComponentProps<typeof MotiView>;

/**
 * 스켈레톤 UI를 감싸는 MotiView 컨테이너입니다.
 * 기본 배경색과 애니메이션 효과가 적용되어 있습니다.
 */
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
