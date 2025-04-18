import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Animated, TouchableOpacity, StyleSheet } from 'react-native'
import DropDownOrga from '../organisms/DropDownContainer.orga'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setShowDropdownView } from '../../redux/slice/commonSlice'

const DropdownAnimationTemplate = () => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const { visibility, pos } = useAppSelector(state => state.commonSlice.showDropDownView);
  const dispatch = useAppDispatch();
  const [rendered, setRendered] = useState(false);

  const onClose = useCallback(() => {
    dispatch(setShowDropdownView({ visibility: false, dropdownList: null ,pos: {x: null, y: null} }));
  }, [dispatch]);

  useEffect(() => {
    if (visibility && pos) {
      setRendered(true);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // if (finished) setRendered(false);
      });
    }
  }, [visibility, pos, animationValue]);

  if (!rendered) return null;

  return (
    <>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View
        style={{
          position: "absolute",
          top: (pos?.y ?? 0),
          left: (pos?.x ?? 0) - 120,
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
  )
}

export default React.memo(DropdownAnimationTemplate);