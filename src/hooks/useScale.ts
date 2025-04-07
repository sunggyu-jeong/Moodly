import { Dimensions } from "react-native";

const BASE_WIDTH = 414;

export const useScale = () => {
  const { width: screenWidth } = Dimensions.get("window");

  const scale = screenWidth / BASE_WIDTH;

  const getScaleSize = (size: number) => Math.round(size * scale);

  return {
    getScaleSize,
  };
}