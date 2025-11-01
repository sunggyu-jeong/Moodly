import { useUpsertPushTokenMutation } from '@/entities/auth/api/auth.api';
import { type BottomSheetHandler, SocialLoginSheet } from '@/features/setting/ui/SocialLoginSheet';
import { isEmpty } from '@/shared';
import { ONBOARDING_ICONS } from '@/shared/assets/images/onboarding';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import colors from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { H2 } from '@/shared/ui/typography/H2';
import { Label } from '@/shared/ui/typography/Label';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  Image,
  ImageSourcePropType,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DotProps {
  active: boolean;
}
interface SlideProps {
  id: number;
  title: string;
  message: string;
  source: ImageSourcePropType;
}

const SLIDES: ReadonlyArray<SlideProps> = [
  {
    id: 1,
    title: '하루에 한 번, 감정을 마주하는 시간',
    message: '무들리는 하루 한 번,\n 나를 돌아보는 시간을 만들어줍니다.',
    source: ONBOARDING_ICONS.onboardingStep1,
  },
  {
    id: 2,
    title: '감정을 고르고, 이유를 적어요',
    message: '감정을 선택하고\n짧게 이유를 적어보세요.',
    source: ONBOARDING_ICONS.onboardingStep2,
  },
  {
    id: 3,
    title: '잊지 않도록 알림을 드려요',
    message: '하루의 감정은 금방 지나가요.\n그 순간을 놓치지 않도록 알려드릴게요.',
    source: ONBOARDING_ICONS.onboardingStep3,
  },
  {
    id: 4,
    title: '감정의 흐름을 파악하세요',
    message: '감정은 달력에 쌓이며\n나를 이해하는 단서가 됩니다.',
    source: ONBOARDING_ICONS.onboardingStep4,
  },
];

const OnboardingPage = () => {
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList<SlideProps>>(null);
  const [index, setIndex] = useState<number>(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const [showAlarmPermission, setShowAlarmPermission] = useState(false);
  const isScrollingRef = useRef(false);
  const socialSheetRef = useRef<BottomSheetHandler>(null);
  const [updateFcmToken] = useUpsertPushTokenMutation();
  const onTokenUpdate = useCallback(
    async (token: string | null) => {
      try {
        if (isEmpty(token)) return;
        await updateFcmToken({ token }).unwrap();
        console.log('App.tsx: 서버 토큰 업데이트 성공');
      } catch (error) {
        console.error('App.tsx: 서버 토큰 업데이트 실패', error);
      }
    },
    [updateFcmToken],
  );
  const { requestUserPermission } = useNotificationPermission({
    setupListeners: false,
    onTokenUpdate: onTokenUpdate,
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        socialSheetRef.current?.close();
      };
    }, []),
  );

  const total = SLIDES.length;
  const isLast = index === total - 1;

  const getItemLayout = useCallback<NonNullable<FlatListProps<SlideProps>['getItemLayout']>>(
    (_, i) => ({
      length: width,
      offset: width * i,
      index: i,
    }),
    [width],
  );

  const keyExtractor = useCallback((item: SlideProps) => String(item.id), []);

  const renderItem = useCallback<ListRenderItem<SlideProps>>(
    ({ item }) => (
      <View style={[styles.slide, { width, height }]}>
        <View style={styles.textSection}>
          <H2 weight="semibold">{item.title}</H2>
          <Label
            weight="regular"
            style={styles.message}
          >
            {item.message}
          </Label>
        </View>
        <Image
          source={item.source}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    ),
    [width, height],
  );

  const onMomentumScrollEnd = useCallback(
    async (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const viewWidth = e.nativeEvent.layoutMeasurement.width;
      const x = e.nativeEvent.contentOffset.x;
      const ratio = x / viewWidth;
      const next = Math.floor(ratio) + (ratio % 1 > 0.3 ? 1 : 0);

      if (next !== index) setIndex(next);
      setShowStartButton(next === total - 1);

      if (next === 2 && !showAlarmPermission) {
        setShowAlarmPermission(true);
        await requestUserPermission();
      }

      isScrollingRef.current = false;
    },
    [index, requestUserPermission, showAlarmPermission, total],
  );

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingRef.current) return;
      const ratio = nativeEvent.contentOffset.x / width;
      const base = Math.floor(ratio);
      const frac = ratio - base;

      if (frac >= 0.2 && base === 2 && showStartButton) {
        setShowStartButton(false);
      }
    },
    [width, showStartButton],
  );

  const Dots = useMemo(() => {
    const Dot = ({ active }: DotProps) => (
      <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
    );
    return () => (
      <View style={styles.dotContainer}>
        {SLIDES.map((s, i) => (
          <Dot
            key={s.id}
            active={i === index}
          />
        ))}
      </View>
    );
  }, [index]);

  const onSkip = () => {
    listRef.current?.scrollToIndex({ index: total - 1, animated: true });
  };

  const startService = async () => {
    socialSheetRef.current?.expand();
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.container}>
        <View style={styles.skipWrapper}>
          {!isLast && (
            <Pressable onPress={onSkip}>
              <Label
                weight="regular"
                style={styles.skipText}
              >
                Skip
              </Label>
            </Pressable>
          )}
        </View>

        <Dots />

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={onScroll}
          getItemLayout={getItemLayout}
          removeClippedSubviews
          windowSize={2}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          overScrollMode={Platform.OS === 'android' ? 'never' : 'auto'}
          scrollEventThrottle={16}
        />

        {showStartButton && (
          <View style={[styles.buttonWrapper, { bottom: Platform.OS === 'android' ? 80 : 48 }]}>
            <ActionButton onPress={startService}>서비스 시작하기</ActionButton>
          </View>
        )}
      </View>

      <SocialLoginSheet ref={socialSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  skipWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  skipText: {
    color: colors.gray[300],
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 40,
  },
  textSection: {
    marginBottom: 40,
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    color: colors.gray[400],
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
    bottom: 48,
    alignItems: 'center',
    gap: 12,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 31,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  dotActive: {
    backgroundColor: colors.primary[300],
  },
  dotInactive: {
    backgroundColor: colors.gray[200],
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
});

export default OnboardingPage;
