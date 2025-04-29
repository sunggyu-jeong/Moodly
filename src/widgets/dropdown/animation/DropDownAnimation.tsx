import { setShowDropdownView } from '@/processes/overlay/model/overlaySlice';
import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import DropDownContainer from '../ui/DropDownContainer';

const DropDownAnimation = () => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const showDropDownView = useAppSelector((state) => state.commonSlice.showDropDownView);
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(
      setShowDropdownView({
        visibility: false,
        dropdownList: showDropDownView?.dropdownList ?? [],
        pos: { x: showDropDownView?.pos?.x ?? 0, y: showDropDownView?.pos?.y ?? 0 },
      })
    );
  }, [dispatch]);

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
          })
        );
      }
    });
  }, [showDropDownView?.visibility, animationValue, dispatch]);

  return (
    <>
      <TouchableOpacity
        style={[StyleSheet.absoluteFill, { zIndex: 998 }]}
        onPress={onClose}
      />
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 998,
          top: showDropDownView?.pos?.y ?? 0,
          left: (showDropDownView?.pos?.x ?? 0) - 120,
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        }}
      >
        <DropDownContainer />
      </Animated.View>
    </>
  );
};

export default DropDownAnimation;
