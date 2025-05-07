import { Image, ImageSourcePropType, View } from 'react-native';

interface TabbarIconProps {
  source: ImageSourcePropType;
}
const TabBarIcon = ({ source }: TabbarIconProps) => {
  return (
    <View>
      <Image
        source={source}
        className="w-8 h-8"
      />
    </View>
  );
};

export default TabBarIcon;
