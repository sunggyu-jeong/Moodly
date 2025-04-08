import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../pages/home.page";
import SplashPage from "../pages/splash.page";
import SelectEmotionPage from "../pages/select-emotion.page";
import { EmotionDiaryDTO } from "../scheme";
import WriteDiaryPage from "../pages/write-diary.page";
import WriteDiaryCompletePage from "../pages/write-diary-complete.page";

export type RootStackParamList = {
  '스플래시': undefined; 
  '메인화면': undefined; 
  '감정선택': undefined;
  '일기작성': EmotionDiaryDTO;
  '작성완료': undefined;
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="스플래시" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="스플래시" component={SplashPage} />
      <Stack.Screen name="메인화면" component={HomePage} />
      <Stack.Screen name="감정선택" component={SelectEmotionPage} />
      <Stack.Screen name="일기작성" component={WriteDiaryPage} />
      <Stack.Screen name="작성완료" component={WriteDiaryCompletePage} />
    </Stack.Navigator>
  )
}

export default RootStack;