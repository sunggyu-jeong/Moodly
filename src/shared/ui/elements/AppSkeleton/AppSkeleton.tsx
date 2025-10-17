import { COLOR_MODE } from '@/shared';
import { Skeleton } from 'moti/skeleton';
import type { ComponentProps } from 'react';

type AppSkeletonProps = Omit<ComponentProps<typeof Skeleton>, 'colorMode'>;

const AppSkeleton = (props: AppSkeletonProps) => {
  return (
    <Skeleton
      colorMode={COLOR_MODE}
      {...props}
    />
  );
};

export default AppSkeleton;
