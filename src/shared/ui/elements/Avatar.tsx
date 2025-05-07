import { Image, ImageSourcePropType } from 'react-native';

import { getScaleSize } from '@/shared/hooks';

export interface AvatarAtomProps {
  source: ImageSourcePropType;
}

const Avatar = ({ source }: AvatarAtomProps) => {
  return (
    <Image
      source={source}
      style={{ width: getScaleSize(40), height: getScaleSize(40) }}
      className="mr-[15px]"
    />
  );
};

export default Avatar;
