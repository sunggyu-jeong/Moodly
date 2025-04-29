import DiaryDetail from '@/pages/DiaryDetail';
import SelectEmotion from '@/pages/SelectEmotion.pge';
import WriteDiary from '@/pages/WriteDiary';
import WriteDiaryComplete from '@/pages/WriteDiaryComplete';
import OverlayManager from '@/processes/overlay/ui/OverlayManager';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type DiaryStackParamList = {
  SelectEmotion: undefined;
  WriteDiary: undefined;
  Complete: undefined;
  DiaryDetail: { origin: string };
};

const Stack = createNativeStackNavigator<DiaryStackParamList>();

const DiaryStack = () => {
  return (
    <>
      <OverlayManager />
      <Stack.Navigator
        initialRouteName="SelectEmotion"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="SelectEmotion"
          component={SelectEmotion}
        />
        <Stack.Screen
          name="WriteDiary"
          component={WriteDiary}
        />
        <Stack.Screen
          name="Complete"
          component={WriteDiaryComplete}
        />
        <Stack.Screen
          name="DiaryDetail"
          component={DiaryDetail}
          initialParams={{ origin: 'DiaryStack' }}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default DiaryStack;
