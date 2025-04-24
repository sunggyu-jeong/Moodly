import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { IMAGES } from '../assets/images';
import DiaryTextBox, { DiaryTextBoxHandle } from '../components/atoms/DiaryTextBox.atm';
import HeaderText from '../components/atoms/HeaderText.atm';
import KeyboardAccessory from '../components/atoms/KeyboardAccessory.atm';
import { NaviActionButtonProps } from '../components/atoms/NaviActionButton.atm';
import NaviDismiss from '../components/molecules/NaviDismiss.mol';
import NavigationBar from '../components/organisms/NavigationBar.org';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '../hooks';
import {
  addDiaryThunk,
  modifyDiaryThunk,
  setSelectedDiary,
} from '../redux/slice/diarySlice';
import { isNotEmpty, navigate } from '../utils';

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
    if (isNotEmpty(selectedDiary)) {
      textBoxRef.current?.setText(selectedDiary?.description ?? '');
    }
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
  }, [isKeyboardVisible, keyboardHeight]);

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
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior="padding"
        keyboardVerticalOffset={ACCESSORY_HEIGHT}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIsKeyboardVisible(false);
          }}
        >
          <View className="bg-white flex-1 items-center px-6">
            <HeaderText style={{ marginTop: getScaleSize(63) }}>
              어떤 일이 있었는지 말해줄래?
            </HeaderText>
            <Image
              source={IMAGES.smile}
              style={{
                marginTop: getScaleSize(26),
                marginBottom: getScaleSize(32),
                width: getScaleSize(137),
                height: getScaleSize(137),
              }}
            />
            <DiaryTextBox
              ref={textBoxRef}
              onFocus={() => setIsKeyboardVisible(true)}
              onBlur={() => setIsKeyboardVisible(false)}
            />
            <View className="flex-1" />
          </View>
        </TouchableWithoutFeedback>
        {isNotEmpty(isKeyboardVisible) && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: accessoryPosition,
            }}
          >
            <KeyboardAccessory onPress={handleSave} />
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </>
  );
};

export default WriteDiary;
