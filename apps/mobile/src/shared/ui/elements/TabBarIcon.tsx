import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { getScaleSize } from '@/shared/hooks/useScale';

interface TabbarIconProps {
  source: ImageSourcePropType;
}
const TabBarIcon = ({ source }: TabbarIconProps) => {
  return (
    <View>
      <Image
        source={source}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: getScaleSize(26),
    width: getScaleSize(26),
  },
});

export default TabBarIcon;
