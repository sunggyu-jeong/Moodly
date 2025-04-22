import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setShowDropdownView } from '../../redux/slice/commonSlice';
import DropDownOrga from '../organisms/DropDownContainer.orga';

const DropdownAnimationTemplate = () => {
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
    console.log(showDropDownView?.visibility);
    if (showDropDownView?.visibility) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          dispatch(
            setShowDropdownView({
              visibility: null,
              dropdownList: null,
              pos: { x: null, y: null },
            })
          );
        }
      });
    }
  }, [showDropDownView?.visibility]);

  return (
    <>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      />
      <Animated.View
        style={{
          position: 'absolute',
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
        <DropDownOrga />
      </Animated.View>
    </>
  );
};

export default DropdownAnimationTemplate;
