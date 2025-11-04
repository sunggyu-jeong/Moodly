import { isNotEmpty } from '@/shared/lib/value.util';
import NaviActionButton, { NaviActionButtonProps } from '@/shared/ui/elements/NaviActionButton';
import NaviBackButton from '@/shared/ui/elements/NaviBackButton';
import React from 'react';
import { View, StyleSheet } from 'react-native';
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
    <View style={[{ paddingTop: insets.top, backgroundColor }]}>
      <View style={[styles.container, hasLeftCenter ? styles.justifyBetween : styles.justifyEnd]}>
        {showBackButton && (
          <View style={styles.leftButtonWrapper}>
            <NaviBackButton />
          </View>
        )}

        {isNotEmpty(leftComponents) && (
          <View style={styles.leftButtonWrapper}>
            {leftComponents.map((el, index) => (
              <NaviActionButton
                key={index}
                {...el}
              />
            ))}
          </View>
        )}

        <View style={styles.flexOne} />

        {centerComponent && <View style={styles.center}>{centerComponent}</View>}

        <View style={styles.flexOne} />

        {isNotEmpty(actionButtons) && (
          <View style={styles.actionButtons}>
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  leftButtonWrapper: {
    marginLeft: 12,
  },
  flexOne: {
    flex: 1,
  },
  center: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  actionButtons: {
    flexDirection: 'row',
    marginRight: 10,
    gap: 12,
  },
});

export default React.memo(NavigationBar);
