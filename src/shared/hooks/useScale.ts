import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const BASE_WIDTH = 414;
const MIN_SCALE = 2; // 작은 화면에서 최대 2배
const MAX_SCALE = 1.2; // 큰 화면에서 최대 1.2배

// 화면 비율 계산
const ratio = screenWidth / BASE_WIDTH;

// 비율에 따른 가중치 계산
const factor =
  ratio < 1
    ? 1 + (1 - ratio) * (MIN_SCALE - 1)
    : 1 + Math.min(ratio - 1, 1) * (MAX_SCALE - 1);

// 최종 곱셈값
const multiplier = 1 + (ratio - 1) * factor;

/**
 * 주어진 크기를 동적 화면 비율에 맞춰 스케일합니다.
 * @param size 원본 크기(px)
 * @returns 스케일된 정수 크기(px)
 */
export function getScaleSize(size: number): number {
  return Math.round(size * multiplier);
}
