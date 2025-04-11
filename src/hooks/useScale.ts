import { Dimensions } from "react-native";

const BASE_WIDTH = 414;

export const useScale = (exponent: number = 1.4) => {
  const { width: screenWidth } = Dimensions.get("window");
  const ratio = screenWidth / BASE_WIDTH;
  const scale = Math.pow(ratio, exponent);
  const getScaleSize = (size: number) => Math.round(size * scale);
  return {
    getScaleSize,
  };
}