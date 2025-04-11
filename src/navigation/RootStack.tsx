import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashPage from "../pages/splash.page";
import SelectEmotionPage from "../pages/select-emotion.page";
import { EmotionDiaryDTO } from "../scheme";
import WriteDiaryPage from "../pages/write-diary.page";
import WriteDiaryCompletePage from "../pages/write-diary-complete.page";
import TabNavigation from "./TabNavigation";

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  SelectEmotion: undefined;
  WriteDiary: undefined;
  Complete: undefined;
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashPage} />
      <Stack.Screen name="Main" component={TabNavigation} />
      <Stack.Screen name="SelectEmotion" component={SelectEmotionPage} />
      <Stack.Screen name="WriteDiary" component={WriteDiaryPage} />
      <Stack.Screen name="Complete" component={WriteDiaryCompletePage} />
    </Stack.Navigator>
  )
}

export default RootStack;