import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DiaryDetail from '@/pages/DiaryDetail';
import Splash from '@/pages/Splash';
import OverlayManager from '@/processes/overlay/ui/OverlayManager';

import DiaryStack, { DiaryStackParamList } from './DiaryStack';
import TabNavigation from './TabNavigation';

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  DiaryStack:
    | {
        screen?: keyof DiaryStackParamList;
        params?: DiaryStackParamList[keyof DiaryStackParamList];
      }
    | undefined;
  DiaryDetail: { origin: string };
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <>
      <OverlayManager />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigation}
        />
        <Stack.Screen
          name="DiaryStack"
          component={DiaryStack}
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="DiaryDetail"
          component={DiaryDetail}
        />
      </Stack.Navigator>
    </>
  );
};

export default RootStack;
