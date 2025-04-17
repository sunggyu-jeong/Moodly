import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashPage from "../pages/splash.page";
import TabNavigation from "./TabNavigation";
import DiaryStack, { DiaryStackParamList } from "./DiaryStack";
import DiaryDetailPage from "../pages/diary-detail.page";

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  DiaryStack: {
    screen?: keyof DiaryStackParamList;
    params?: DiaryStackParamList[keyof DiaryStackParamList];
  } | undefined;
  DiaryDetail: { origin: string };
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashPage} />
      <Stack.Screen name="Main" component={TabNavigation} />
      <Stack.Screen
        name="DiaryStack"
        component={DiaryStack}
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="DiaryDetail" component={DiaryDetailPage} />
    </Stack.Navigator>
  )
}

export default RootStack;