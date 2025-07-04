import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EmotionDiaryDetailPage from '@pages/EmotionDiaryDetailPage.tsx';
import OverlayManager from '@processes/overlay/ui/OverlayManager';

import Splash from '../ui/screens/Splash';

import Login from '@pages/LoginPage.tsx';
import DiaryStack, { DiaryStackParamList } from './DiaryStack';
import TabNavigation from './TabNavigation';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  DiaryList: undefined;
  DiaryStack:
    | {
        screen?: keyof DiaryStackParamList;
        params?: DiaryStackParamList[keyof DiaryStackParamList];
      }
    | undefined;
  EmotionDetailPage: { origin: string };
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
  // useSupabaseAuth();
  return (
    <>
      <OverlayManager />
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash">
          {() => (
            <Splash
              status="UPDATE_PROCESS_COMPLETED"
              progress={100}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
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
          component={EmotionDiaryDetailPage}
        />
      </Stack.Navigator>
    </>
  );
};

export default RootStack;
