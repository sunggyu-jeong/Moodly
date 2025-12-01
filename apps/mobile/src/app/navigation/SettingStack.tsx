import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ManageAccountPage from '@/pages/ManageAccountPage';
import SettingPage from '@/pages/SettingPage';

export type SettingStackParamList = {
  Setting: undefined;
  ManageAccount: undefined;
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

const SettingStack = () => {
  return (
    <>
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
