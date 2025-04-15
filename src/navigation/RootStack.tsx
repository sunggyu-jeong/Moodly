import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashPage from "../pages/splash.page";
import TabNavigation from "./TabNavigation";
import DiaryStack, { DiaryStackParamList } from "./DiaryStack";

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  DiaryStack: {
    screen?: keyof DiaryStackParamList;
    params?: DiaryStackParamList[keyof DiaryStackParamList];
  } | undefined;
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
    </Stack.Navigator>
  )
}

export default RootStack;