import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../pages/home.page";
import SplashPage from "../pages/splash.page";

export type RootStackParamList = {
  '스플래시': undefined; 
  '메인화면': undefined; 
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="스플래시" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="스플래시" component={SplashPage} />
      <Stack.Screen name="메인화면" component={HomePage} />
    </Stack.Navigator>
  )
}

export default RootStack;