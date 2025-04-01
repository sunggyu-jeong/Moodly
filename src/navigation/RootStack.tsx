import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PushTestPage from "../components/pages/push-test.page";
import HomePage from "../components/pages/home.page";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="푸시테스트" component={PushTestPage} options={{ headerShown: false }} />
      <Stack.Screen name="메인화면" component={HomePage} />
    </Stack.Navigator>
  )
}

export default RootStack;