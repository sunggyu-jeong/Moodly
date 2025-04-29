import { useEffect } from 'react';
import { View } from 'react-native';
import ActionButton from '../components/atoms/ActionButton';
import HeaderText from '../components/atoms/HeaderText';
import { NaviActionButtonProps } from '../components/atoms/NaviActionButton';
import NaviDismiss from '../components/molecules/NaviDismiss';
import { ICON_DATA } from '../constant/Icons';
import { getScaleSize, useAppDispatch, useAppSelector } from '../hooks';
import { setSelectedIcon, setTodayDiary } from '../redux/slice/diarySlice';
import { EmotionDiaryDTO } from '../scheme';
import { isNotEmpty, navigate } from '../utils';
import EmotionList from '../widgets/emotion/ui/EmotionList';
import SelectedEmotion from '../widgets/emotion/ui/SelectedEmotion';
import NavigationBar from '../widgets/navigation-bar/ui/NavigationBar';

const SelectEmotion = () => {
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector((state) => state.diarySlice.selectedIcon);
  const actionButtons: NaviActionButtonProps[] = [
    {
      item: <NaviDismiss />,
      disabled: false,
    },
  ];
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);

  const handleSelectEmotion = () => {
    const emotion: EmotionDiaryDTO = {
      iconId: selectedEmotion?.id,
    };
    dispatch(setTodayDiary(emotion));
    navigate('DiaryStack', { screen: 'WriteDiary' });
  };

  useEffect(() => {
    // 수정일 때 사용
    if (isNotEmpty(selectedDiary)) {
      dispatch(setSelectedIcon(ICON_DATA.find((el) => el.id === selectedDiary.iconId)));
      const emotion: EmotionDiaryDTO = {
        iconId: selectedDiary?.iconId,
      };
      dispatch(setTodayDiary(emotion));
    }
  }, [selectedDiary]);

  return (
    <>
      <NavigationBar
        showBackButton={false}
        actionButtons={actionButtons}
      />
      <View className="bg-white items-center flex-1">
        <HeaderText style={{ marginTop: getScaleSize(64) }}>
          오늘 너의 마음과 가장 닮은 친구를 골라줘
        </HeaderText>
        <SelectedEmotion />
        <View className="flex-1" />
        <EmotionList emotionList={ICON_DATA} />

        <View
          className="w-full"
          style={{ marginBottom: getScaleSize(57) }}
        >
          <ActionButton onPress={handleSelectEmotion}>선택 완료</ActionButton>
        </View>
      </View>
    </>
  );
};

export default SelectEmotion;
