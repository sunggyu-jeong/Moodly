import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EmotionDiaryDetailPage from '@pages/EmotionDiaryDetailPage.tsx';
import OverlayManager from '@processes/overlay/ui/OverlayManager';

import Splash from '../ui/screens/Splash';

import Login from '@pages/LoginPage.tsx';
import NotificationPermissionPage from '@pages/NotificationPermissionPage';
import { NavigatorScreenParams } from '@react-navigation/native';
import NicknamePage from '../../pages/NicknamePage';
import OnboardingPage from '../../pages/OnBoardingPage';
import DiaryStack, { DiaryStackParamList } from './DiaryStack';
import TabNavigation, { BottomTabParamList } from './TabNavigation';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  NotificationPermissionPage: undefined;
  Nickname: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  DiaryList: undefined;
  DiaryStack: NavigatorScreenParams<DiaryStackParamList>;
  EmotionDiaryDetailPage: { origin: string };
};

const Stack = createNativeStackNavigator();

const RootStack = () => {
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
          name="NotificationPermissionPage"
          component={NotificationPermissionPage}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingPage}
        />
        <Stack.Screen
          name="Nickname"
          component={NicknamePage}
        />
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
          name="EmotionDiaryDetailPage"
          component={EmotionDiaryDetailPage}
        />
      </Stack.Navigator>
    </>
  );
};

export default RootStack;
