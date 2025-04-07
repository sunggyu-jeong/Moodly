// src/components/organisms/EmotionCarousel.tsx
import { useRef, useState } from 'react';
import { View, Animated, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Text, ImageSourcePropType } from 'react-native';
import { useScale } from '../../hooks';
import CarouselItem from '../molecules/CarouselItem.mol';
import CarouselIndicator from '../atoms/CarouselIndicator.atom';
import { useDispatch } from 'react-redux';
import { setSelectedEmotion } from '../..//redux/slice/diarySlice';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;

export interface EmotionDataProps {
  id: number;
  uri: any;
  text: string;
  description: string;
}

const EmotionCarouselList = ({ emotionData }: { emotionData: EmotionDataProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getScaleSize } = useScale();
  const scrollX = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const horizontalOffset = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(horizontalOffset / ITEM_WIDTH);
    setCurrentIndex(newIndex);
    dispatch(setSelectedEmotion(emotionData[newIndex]));
  };

  return (
    <View className='h-[375px] items-center justify-center'>
      <Animated.FlatList
        data={emotionData}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (width - ITEM_WIDTH) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} scrollX={scrollX} />
        )}
      />
      <Text
        className='font-pretendard font-bold tracking-[-0.5px]'
        style={{
          fontSize: getScaleSize(29),
          marginTop: getScaleSize(44),
          marginBottom: getScaleSize(22),
        }}
      >
        {emotionData[currentIndex].text}
      </Text>
      <Text 
        className='font-pretendard font-normal tracking-[-0.5px]'
        style={{ fontSize: getScaleSize(19), marginBottom: getScaleSize(41) }}
      >
        {emotionData[currentIndex].description}
      </Text>
      <CarouselIndicator dataCount={emotionData.length} currentIndex={currentIndex} />
    </View>
  );
};

export default EmotionCarouselList;