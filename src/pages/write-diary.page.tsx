import { useEffect, useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { IMAGES } from '../assets/images';
import DiaryTextBox, { DiaryTextBoxHandle } from '../components/atoms/DiaryTextBox.atom';
import HeaderText from '../components/atoms/HeaderText.atom';
import { NaviActionButtonProps } from '../components/atoms/NaviActionButton.atom';
import NaviDismiss from '../components/molecules/NaviDismiss.mol';
import NavigationBar from '../components/organisms/NavigationBar.org';
import { useAppDispatch, useAppSelector, useRealm, useScale } from '../hooks';
import {
  addDiaryThunk,
  modifyDiaryThunk,
  setSelectedDiary,
} from '../redux/slice/diarySlice';
import { isNotEmpty, navigate } from '../utils';

const WriteDiaryPage = () => {
  const { getScaleSize } = useScale();
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const todayDiary = useAppSelector((state) => state.diarySlice.todayDiary);
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);

  const actionButtons: NaviActionButtonProps[] = [
    {
      item: <NaviDismiss />,
      disabled: false,
    },
  ];

  const handleSave = async () => {
    const realm = await openRealm();
    const text = textBoxRef.current?.getText();

    // 텍스트 및 Realm 체크
    if (!isNotEmpty(text) || !isNotEmpty(realm)) return;

    console.log('저장된 일기:', text);
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

  useEffect(() => {
    if (isNotEmpty(selectedDiary)) {
      textBoxRef.current?.setText(selectedDiary?.description ?? '');
    }
  }, [selectedDiary]);

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <ScrollView
        ref={scrollViewRef}
        className="bg-white flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
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
        <DiaryTextBox ref={textBoxRef} />
        <View className="flex-1" />
      </ScrollView>
      <KeyboardAccessoryView>
        <TouchableOpacity
          onPress={handleSave}
          className="ml-auto w-10 mr-5"
        >
          <Text
            className="font-semibold text-right leading-10 whitespace-nowrap"
            style={{ fontSize: getScaleSize(16) }}
          >
            저장
          </Text>
        </TouchableOpacity>
      </KeyboardAccessoryView>
    </>
  );
};

export default WriteDiaryPage;
