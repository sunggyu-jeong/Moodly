import { getScaleSize } from '@shared/hooks';
import { isNotEmpty } from '@shared/lib';
import NaviActionButton, { type NaviActionButtonProps } from '@shared/ui/elements/NaviActionButton';
import NaviBackButton from '@shared/ui/elements/NaviBackButton';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface NavigationBarConfig {
  showBackButton?: boolean;
  leftComponents?: NaviActionButtonProps[] | null;
  centerComponent?: React.ReactNode;
  actionButtons?: NaviActionButtonProps[];
  backgroundColor?: string;
}

const NavigationBar = ({
  showBackButton = true,
  centerComponent,
  actionButtons,
  leftComponents,
  backgroundColor = 'white',
}: NavigationBarConfig) => {
  const hasLeftCenter = showBackButton || isNotEmpty(centerComponent);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor }}>
      <View
        className={`flex-row items-center h-[40px] px-[10px] ${hasLeftCenter ? 'justify-between' : 'justify-end'}`}
        style={styles.container}
      >
        {showBackButton && (
          <View className="ml-3">
            <NaviBackButton />
          </View>
        )}

        {isNotEmpty(leftComponents) && (
          <View className="ml-3">
            {leftComponents.map((el, index) => (
              <NaviActionButton
                key={index}
                {...el}
              />
            ))}
          </View>
        )}
        <View className="flex-1" />

        {centerComponent && <View style={styles.center}>{centerComponent}</View>}

        <View className="flex-1" />

        {isNotEmpty(actionButtons) && (
          <View className="flex-row mr-[10px] gap-3">
            {actionButtons.map((el, index) => (
              <NaviActionButton
                key={index}
                {...el}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: getScaleSize(56),
  },
  center: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // 이 컨테이너가 다른 버튼의 터치를 막지 않도록 설정
    pointerEvents: 'box-none',
  },
});
export default React.memo(NavigationBar);
