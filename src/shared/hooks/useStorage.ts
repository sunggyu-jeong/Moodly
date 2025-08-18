import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { isEmpty } from '@/shared/lib';

const useStorage = <T>(
  key: string,
  defaultValue: T,
): [T | null, (value: T) => Promise<void>, () => Promise<void>] => {
  // useState Hook을 사용하여 상태(storedValue)를 관리합니다.
  const [storedValue, setStoredValue] = useState<T | null>(defaultValue);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : null);
      } catch (error) {
        console.error('Error getting stored value from storage:', error);
      }
    };
    fetchValue();
  }, [key]);

  /**
   * 상태와 지정된 저장소(로컬 또는 세션)에 값을 설정합니다.
   *
   * @param value - 저장할 값.
   * @throws 저장소에 값을 설정하는 데 실패하면 콘솔에 오류를 기록합니다.
   */
  const setValue = async (value: T | undefined) => {
    if (isEmpty(value)) {
      return;
    }
    try {
      setStoredValue(value ?? null);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting stored value in storage:', error);
    }
  };

  /**
   * 저장소에서 값을 제거합니다.
   *
   * @throws 저장소에서 값을 제거하는 데 실패하면 콘솔에 오류를 기록합니다.
   */
  const removeValue = async () => {
    try {
      setStoredValue(null);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing stored value from storage:', error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useStorage;
