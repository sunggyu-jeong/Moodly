import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DiaryDetail from '@/features/diary/ui/screen/DiaryDetail';
import OverlayManager from '@/processes/overlay/ui/OverlayManager';

import Splash from '../ui/screens/Splash';

import { useSupabaseAuth } from '@/features/auth/hooks/useSupabaseAuth';
import Login from '@/features/auth/ui/screen/Login';
import { useAppSelector } from '@/shared/hooks';
import { useEffect } from 'react';
import DiaryStack, { DiaryStackParamList } from './DiaryStack';
import TabNavigation from './TabNavigation';

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  DiaryList: undefined;
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
  useSupabaseAuth();
  const userInfo = useAppSelector(state => state.authSlice.userInfo);

  useEffect(() => {
    console.log('>>>>>>>>>>>>>>>>>>>>', userInfo);
  }, [userInfo]);
  return (
    <>
      <OverlayManager />
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Login"
          component={() => <Login />}
        />
        <Stack.Screen
          name="Splash"
          component={() => (
            <Splash
              status="UPDATE_PROCESS_COMPLETED"
              progress={100}
            />
          )}
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
