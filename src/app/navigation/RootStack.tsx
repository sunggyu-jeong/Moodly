import EmotionDiaryDetailPage from '@/pages/EmotionDiaryDetailPage';
import Login from '@/pages/LoginPage';
import NicknamePage from '@/pages/NicknamePage';
import OnboardingPage from '@/pages/OnBoardingPage';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Splash } from '../ui';
import DiaryStack, { type DiaryStackParamList } from './DiaryStack';
import TabNavigation, { type BottomTabParamList } from './TabNavigation';

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
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash">{() => <Splash />}</Stack.Screen>
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
