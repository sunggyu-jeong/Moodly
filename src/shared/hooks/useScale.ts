import { useCallback, useMemo } from 'react';
import { Dimensions } from 'react-native';

const BASE_WIDTH = 414;
const MIN_SCALE = 2; // 작은 화면에서 최대 2배
const MAX_SCALE = 1.2; // 큰 화면에서 최대 1.2배

/**
 * 컴포넌트 내부에서 사용하는 스케일링 사이즈 설정
 *
 * @returns - (메모이제이션) 스케일링된 사이즈 반환
 */
export function useScale() {
  const { width: screenWidth } = Dimensions.get('window');

  const multiplier = useMemo(() => {
    const rawRatio = screenWidth / BASE_WIDTH;
    const ratio = rawRatio < 1 ? rawRatio : Math.min(rawRatio, MAX_SCALE);
    const factor =
      ratio < 1 ? 1 + (1 - ratio) * (MIN_SCALE - 1) : 1 + Math.min(ratio - 1, 1) * (MAX_SCALE - 1);
    return 1 + (ratio - 1) * factor;
  }, [screenWidth]);

  const getScaleSize = useCallback(
    (size: number): number => {
      return Math.round(size * Math.max(multiplier, MAX_SCALE));
    },
    [multiplier]
  );

  return { getScaleSize };
}

/**
 * 컴포넌트 외부에서 사용하는 순수함수형 스케일링 사이즈 설정
 *
 * @param size - 스케일링할 사이즈
 * @returns - 스케일링된 사이즈 반환
 */
export function getScaleSize(size: number): number {
  const { width: screenWidth } = Dimensions.get('window');
  const rawRatio = screenWidth / BASE_WIDTH;
  const ratio = rawRatio < 1 ? rawRatio : Math.min(rawRatio, MAX_SCALE);
  const factor =
    ratio < 1 ? 1 + (1 - ratio) * (MIN_SCALE - 1) : 1 + Math.min(ratio - 1, 1) * (MAX_SCALE - 1);
  const multiplier = 1 + (ratio - 1) * factor;
  return Math.round(size * Math.max(multiplier, MAX_SCALE));
}
