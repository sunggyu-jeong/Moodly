import { ImageSourcePropType } from "react-native";
import { useScale } from "../../hooks";
import { Image } from "react-native";

export interface AvatarAtomProps {
  source: ImageSourcePropType;
}

const AvatarAtom = ({ source }: AvatarAtomProps) => {
  const { getScaleSize } = useScale();
  return (
    <Image
      source={source}
      style={{ width: getScaleSize(48), height: getScaleSize(48) }}
      className="mr-[10px]"
    />
  );
}

export default AvatarAtom;