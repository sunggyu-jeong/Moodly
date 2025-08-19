import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';

import { getScaleSize } from '@/shared/hooks';

interface TabbarIconProps {
  source: ImageSourcePropType;
}
const TabBarIcon = ({ source }: TabbarIconProps) => {
  return (
    <View>
      <Image
        source={source}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: getScaleSize(32),
    width: getScaleSize(32),
  },
});

export default TabBarIcon;
