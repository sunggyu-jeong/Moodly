import { useCallback, useMemo } from 'react';
import { Dimensions } from 'react-native';

// 스케일 기준 화면 너비 (포인트 단위)
const MIN_SCREEN_WIDTH = 320; // iPhone SE 기준 너비
const BASE_WIDTH = 414; // 기준 화면 너비(iPhone 11)
const MAX_SCREEN_WIDTH = 1024; // iPad Pro 12.9" 기준 너비

// 스케일 범위
const MIN_SCALE = 0.7; // iPhone SE에서 0.7배
const BASE_SCALE = 1.0; // 기준 너비에서 1배
const MAX_SCALE = 1.5; // iPad Pro에서 1.5배

/**
 * 화면 너비에 따라 스케일 비율 계산
 *
 * @param screenWidth - 화면 너비
 * @returns - 스케일 비율
 */
function computeScaleFactor(screenWidth: number): number {
  if (screenWidth <= MIN_SCREEN_WIDTH) {
    return MIN_SCALE;
  } else if (screenWidth >= MAX_SCREEN_WIDTH) {
    return MAX_SCALE;
  } else if (screenWidth <= BASE_WIDTH) {
    // MIN_SCREEN_WIDTH → BASE_WIDTH 구간: 0.7 → 1.0 선형 보간
    return (
      MIN_SCALE +
      ((screenWidth - MIN_SCREEN_WIDTH) * (BASE_SCALE - MIN_SCALE)) /
        (BASE_WIDTH - MIN_SCREEN_WIDTH)
    );
  } else {
    // BASE_WIDTH → MAX_SCREEN_WIDTH 구간: 1.0 → 1.5 선형 보간
    return (
      BASE_SCALE +
      ((screenWidth - BASE_WIDTH) * (MAX_SCALE - BASE_SCALE)) / (MAX_SCREEN_WIDTH - BASE_WIDTH)
    );
  }
}

/**
 * 컴포넌트 내부에서 사용하는 스케일링 사이즈 설정 커스텀 훅
 *
 * @returns - (메모이제이션) 스케일링된 사이즈 반환
 */
export function useScale() {
  const { width: screenWidth } = Dimensions.get('window');

  const scale = useMemo(() => computeScaleFactor(screenWidth), [screenWidth]);

  const getScaleSize = useCallback((size: number) => Math.round(size * scale), [scale]);

  return { getScaleSize, scale };
}

/**
 * 컴포넌트 외부에서 순수하게 호출하는 함수
 */
export function getScaleSize(size: number): number {
  const { width: screenWidth } = Dimensions.get('window');
  const scale = computeScaleFactor(screenWidth);
  return Math.round(size * scale);
}
