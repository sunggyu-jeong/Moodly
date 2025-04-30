import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  addDiaryThunk,
  modifyDiaryThunk,
  setSelectedDiary,
} from '@/features/diary/model/diary.slice';
import DiaryTextBox, { DiaryTextBoxHandle } from '@/features/diary/ui/DiaryTextBox';
import { IMAGES } from '@/shared/assets/images';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '@/shared/hooks';
import { isNotEmpty, navigate } from '@/shared/lib';
import HeaderText from '@/shared/ui/elements/HeaderText';
import KeyboardAccessory from '@/shared/ui/elements/KeyboardAccessory';
import { NaviActionButtonProps } from '@/shared/ui/elements/NaviActionButton';
import NaviDismiss from '@/widgets/navigation-bar/ui/NaviDismiss';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

const WriteDiary = () => {
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);
  const todayDiary = useAppSelector((state) => state.diarySlice.todayDiary);
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(450);
  const ACCESSORY_HEIGHT = getScaleSize(40);
  const accessoryPosition = useRef(new Animated.Value(-ACCESSORY_HEIGHT)).current;
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const actionButtons: NaviActionButtonProps[] = [
    {
      item: <NaviDismiss />,
      disabled: false,
    },
  ];

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      sub.remove();
    });
  }, []);

  useEffect(() => {
    Animated.timing(accessoryPosition, {
      toValue: isKeyboardVisible ? keyboardHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && isKeyboardVisible === false) {
        setIsKeyboardVisible(null);
      }
    });
  }, [accessoryPosition, isKeyboardVisible, keyboardHeight]);

  const handleSave = async () => {
    const realm = await openRealm();
    const text = textBoxRef.current?.getText();

    // 텍스트 및 Realm 체크
    if (!isNotEmpty(text) || !isNotEmpty(realm)) return;

    const diary = { ...todayDiary, description: text };

    // 수정 또는 추가 Thunk 결정
    const thunk = isNotEmpty(selectedDiary)
      ? modifyDiaryThunk({
          realm,
          emotionId: selectedDiary?.emotionId ?? -1,
          data: diary,
        })
      : addDiaryThunk({ realm, data: diary });

    // 실행 및 결과 처리
    const result = await dispatch(thunk);
    const emotionId = result.payload as number | undefined;
    diary.emotionId = emotionId;

    await closeRealm();
    dispatch(setSelectedDiary(diary));
    navigate('DiaryStack', { screen: 'Complete' });
  };

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={ACCESSORY_HEIGHT}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIsKeyboardVisible(false);
          }}
        >
          <KeyboardAwareScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.contentContainer
                ? styles.contentKeyboardVisible
                : styles.contentKeyboardHidden,
            ]}
            enableOnAndroid={true}
            extraScrollHeight={ACCESSORY_HEIGHT}
            keyboardOpeningTime={150}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps="handled"
          >
            <HeaderText style={{ marginTop: getScaleSize(63) }}>
              어떤 일이 있었는지 말해줄래?
            </HeaderText>
            <Image
              source={IMAGES.smile}
              style={styles.emotionImage}
            />
            <DiaryTextBox
              ref={textBoxRef}
              initialText={isNotEmpty(selectedDiary) ? selectedDiary.description : ''}
              onFocus={(e) => {
                setIsKeyboardVisible(true);
                scrollRef.current?.scrollToFocusedInput(e.target, ACCESSORY_HEIGHT / 4);
              }}
              onBlur={() => setIsKeyboardVisible(false)}
              onContentSizeChange={(e) => {
                scrollRef.current?.scrollToFocusedInput(e.target, ACCESSORY_HEIGHT / 4);
              }}
            />

            <View className="flex-1" />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
        {isNotEmpty(isKeyboardVisible) && (
          <Animated.View style={[styles.accessory, { bottom: accessoryPosition }]}>
            <KeyboardAccessory onPress={handleSave} />
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </>
  );
};

const BACKGROUND_COLOR = '#FFFFFF';

const styles = StyleSheet.create({
  accessory: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: getScaleSize(24),
    paddingTop: getScaleSize(63),
  },
  contentKeyboardHidden: {
    paddingBottom: getScaleSize(32),
  },
  contentKeyboardVisible: {
    paddingBottom: getScaleSize(40),
  },
  emotionImage: {
    height: getScaleSize(137),
    marginBottom: getScaleSize(32),
    marginTop: getScaleSize(26),
    width: getScaleSize(137),
  },
  scroll: {
    flex: 1,
  },
});

export default WriteDiary;
