import { setShowDropdownView } from '@/processes/overlay/model/overlaySlice';
import { useAppDispatch, useAppSelector } from '@/shared';
import { DropDownContainer } from '@/widgets/dropdown';
import { useCallback, useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity } from 'react-native';

const DropDownAnimation = () => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const showDropDownView = useAppSelector(state => state.overlaySlice.showDropDownView);
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(
      setShowDropdownView({
        visibility: false,
        dropdownList: showDropDownView?.dropdownList ?? [],
        pos: { x: showDropDownView?.pos?.x ?? 0, y: showDropDownView?.pos?.y ?? 0 },
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
    Animated.timing(animationValue, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
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
  }, [showDropDownView?.visibility, animationValue, dispatch]);

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
            opacity: animationValue,
            transform: [
              {
                translateY: animationValue.interpolate({
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
