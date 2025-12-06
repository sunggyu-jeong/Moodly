import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { EMOTION_ICON_MAP } from '@/entities/ai-report/model/constants';
import { UIEmotionKey } from '@/entities/ai-report/model/ui';

const EMOTION_SEQUENCE: UIEmotionKey[] = ['joy', 'calm', 'anxiety', 'sad', 'angry'];

const EmotionLoading = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % EMOTION_SEQUENCE.length);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const currentEmotion = EMOTION_SEQUENCE[currentIndex];
  const iconSource = EMOTION_ICON_MAP[currentEmotion];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={iconSource}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 60,
    height: 60,
  },
});

export default EmotionLoading;
