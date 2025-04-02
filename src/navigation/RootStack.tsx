import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PushTestPage from "../pages/push-test.page";
import HomePage from "../pages/home.page";

export type RootStackParamList = {
  '푸시테스트': undefined;
  '메인화면': undefined; 
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="푸시테스트" component={PushTestPage} options={{ headerShown: false }} />
      <Stack.Screen name="메인화면" component={HomePage} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default RootStack;