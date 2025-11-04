import { COLOR_MODE } from '@/shared/constants/Constants';
import { Skeleton } from 'moti/skeleton';
import { ComponentProps } from 'react';

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
