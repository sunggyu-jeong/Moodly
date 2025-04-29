import { Dimensions } from 'react-native';

const BASE_WIDTH = 414;
const { width: screenWidth } = Dimensions.get('window');
const ratio = screenWidth / BASE_WIDTH;

/**
 * 화면 크기에 비례하여 주어진 픽셀 크기를 스케일링합니다.
 * @param size 원본 크기(px)
 * @param factor 스케일 조정 인자 (기본값 0.5)
 * @returns 스케일된 정수 크기(px)
 */
export function getScaleSize(size: number, factor: number = 0.5): number {
  const scaledSize = size * ratio;
  const result = size + (scaledSize - size) * factor;
  return Math.round(result);
}
