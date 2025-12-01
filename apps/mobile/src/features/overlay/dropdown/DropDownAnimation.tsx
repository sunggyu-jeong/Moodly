import { useCallback, useEffect, useMemo } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity } from 'react-native';

import DropDownContainer from '@/features/overlay/dropdown/DropDownContainer';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { setShowDropdownView } from '@/shared/model/overlaySlice';

const DropDownAnimation = () => {
  const animation = useMemo(() => new Animated.Value(0), []);

  const showDropDownView = useAppSelector(state => state.overlay.showDropDownView);
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(
      setShowDropdownView({
        visibility: false,
        dropdownList: showDropDownView?.dropdownList ?? [],
        pos: {
          x: showDropDownView?.pos?.x ?? 0,
          y: showDropDownView?.pos?.y ?? 0,
        },
      }),
    );
  }, [
    dispatch,
    showDropDownView?.dropdownList,
    showDropDownView?.pos?.x,
    showDropDownView?.pos?.y,
  ]);

  useEffect(() => {
    const toValue = showDropDownView?.visibility ? 1 : 0;

    const anim = Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    });

    anim.start(({ finished }) => {
      if (!showDropDownView?.visibility && finished) {
        dispatch(
          setShowDropdownView({
            visibility: null,
            dropdownList: null,
            pos: { x: null, y: null },
          }),
        );
      }
    });
  }, [animation, showDropDownView?.visibility, dispatch]);

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={onClose}
      />
      <Animated.View
        style={[
          {
            top: (showDropDownView?.pos?.y ?? 0) - (Platform.OS === 'android' ? 70 : 0),
            left: (showDropDownView?.pos?.x ?? 0) - 120,
          },
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
          styles.animate,
        ]}
      >
        <DropDownContainer />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  animate: {
    position: 'absolute',
    zIndex: 998,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default DropDownAnimation;
