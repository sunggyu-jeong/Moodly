import { Body2, H3 } from '@/shared';
import { useRef, useEffect } from 'react';
import { Animated, Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = ({ visible }: { visible: boolean }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.loadingCard, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.spinnerContainer}>
            <Animated.View style={[styles.spinnerOuter, { transform: [{ rotate: spin }] }]}>
              <View style={styles.spinnerDot1} />
              <View style={styles.spinnerDot2} />
              <View style={styles.spinnerDot3} />
            </Animated.View>
            <ActivityIndicator
              size="large"
              color="#4F46E5"
              style={styles.centerSpinner}
            />
          </View>
          <H3 style={styles.loadingTitle}>AI 분석 중</H3>
          <Body2 style={styles.loadingSubtitle}>선택하신 일기를 분석하고 있어요</Body2>
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  scrollViewContent: { padding: 16, paddingBottom: 88 },
  cardWrapper: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    transition: 'all 0.2s',
  },
  cardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionBarDisabled: {
    opacity: 0.5,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  spinnerContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  spinnerOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerDot1: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
  },
  spinnerDot2: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#818CF8',
  },
  spinnerDot3: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7D2FE',
  },
  centerSpinner: {
    position: 'absolute',
  },
  loadingTitle: {
    color: '#1F2937',
    marginBottom: 8,
    fontWeight: '600',
  },
  loadingSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
});

export default LoadingOverlay;
