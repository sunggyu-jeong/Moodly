import { View } from 'react-native';

interface CarouselIndicatorProps {
  dataCount: number;
  currentIndex: number;
}

const CarouselIndicator = ({ dataCount, currentIndex }: CarouselIndicatorProps) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
      {Array.from({ length: dataCount }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            margin: 4,
            backgroundColor: currentIndex === index ? '#000' : '#d9d9d9',
          }}
        />
      ))}
    </View>
  );
};

export default CarouselIndicator;