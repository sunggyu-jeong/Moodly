import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectEmotionPage from "../pages/select-emotion.page";
import WriteDiaryPage from "../pages/write-diary.page";
import WriteDiaryCompletePage from "../pages/write-diary-complete.page";
import DiaryDetailPage from "../pages/diary-detail.page";
import DropDownAnimationTemp from "../components/templates/DropDownAnimation.temp";
import { CommonActions } from '@react-navigation/native';

export type DiaryStackParamList = {
  SelectEmotion: undefined;
  WriteDiary: undefined;
  Complete: undefined;
  DiaryDetail: { origin: string };
};

const Stack = createNativeStackNavigator<DiaryStackParamList>();

const DiaryStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="SelectEmotion"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SelectEmotion" component={SelectEmotionPage} options={{ presentation: 'fullScreenModal'}} />
        <Stack.Screen name="WriteDiary" component={WriteDiaryPage} />
        <Stack.Screen name="Complete" component={WriteDiaryCompletePage} />
        <Stack.Screen name="DiaryDetail" component={DiaryDetailPage} initialParams={{ origin: "DiaryStack" }} />
      </Stack.Navigator>
      <DropDownAnimationTemp />
    </>
    
  );
};

export default DiaryStack;