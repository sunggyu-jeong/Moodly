import { getScaleSize } from '@/shared/hooks';
import { Image, ImageSourcePropType } from 'react-native';

export interface AvatarAtomProps {
  source: ImageSourcePropType;
}

const Avatar = ({ source }: AvatarAtomProps) => {
  return (
    <Image
      source={source}
      style={{ width: getScaleSize(48), height: getScaleSize(48) }}
      className="mr-[10px]"
    />
  );
};

export default Avatar;
