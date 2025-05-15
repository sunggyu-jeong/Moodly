import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subShow = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const subHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  return keyboardHeight;
}
