import { SkeletonContainer } from '@shared';
import React, { memo, type PropsWithChildren } from 'react';
import { View } from 'react-native';

const Divider = () => <View className="w-full h-px bg-gray-100 mx-4" />;

const SettingWidgetGroup = ({ children }: PropsWithChildren) => {
  const items = React.Children.toArray(children);
  return (
    <SkeletonContainer className="bg-common-white rounded-xl overflow-hidden">
      {items.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </SkeletonContainer>
  );
};

export default memo(SettingWidgetGroup);
