import { Image, ImageSourcePropType, View } from 'react-native';

interface TabbarIconProps {
  source: ImageSourcePropType;
}
const TabBarIcon = ({ source }: TabbarIconProps) => {
  return (
    <View className="flex-1 justify-end">
      <Image
        source={source}
        className="w-8 h-8"
      />
    </View>
  );
};

export default TabBarIcon;
