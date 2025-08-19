import { useScale } from '@shared/hooks';
import { Image, type ImageSourcePropType } from 'react-native';

export interface AvatarAtomProps {
  source: ImageSourcePropType;
}

const Avatar = ({ source }: AvatarAtomProps) => {
  const { getScaleSize } = useScale();
  return (
    <Image
      source={source}
      style={{ width: getScaleSize(40), height: getScaleSize(40) }}
      className="mr-[15px]"
    />
  );
};

export default Avatar;
