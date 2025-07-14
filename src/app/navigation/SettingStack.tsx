import ManageAccountPage from '@pages/ManageAccountPage';
import SettingPage from '@pages/SettingPage';
import OverlayManager from '@processes/overlay/ui/OverlayManager';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type SettingStackParamList = {
  Setting: undefined;
  ManageAccount: undefined;
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

const SettingStack = () => {
  return (
    <>
      <OverlayManager />
      <Stack.Navigator
        initialRouteName="Setting"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Setting"
          component={SettingPage}
        />
        <Stack.Screen
          name="ManageAccount"
          component={ManageAccountPage}
        />
      </Stack.Navigator>
    </>
  );
};

export default SettingStack;
