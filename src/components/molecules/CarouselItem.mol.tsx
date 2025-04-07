import { View, Animated, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const ITEM_WIDTH = width * 0.6;

interface CarouselItemProps {
  item: {
    id: number;
    uri: any;
  };
  scrollX: Animated.Value;
  index: number;
}

const CarouselItem = ({ item, scrollX, index }: CarouselItemProps) => {
  const inputRange = [
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
    (index + 1) * ITEM_WIDTH,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={{
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          overflow: 'hidden',
          transform: [{ scale }],
        }}
      >
        <Image
          source={item.uri}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};

export default CarouselItem;