import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EmotionDiaryDetailPage from '@pages/EmotionDiaryDetailPage.tsx';
import EmotionSelectionPage from '@pages/EmotionSelectionPage.tsx';
import EmotionDiaryWritePage from '@pages/EmotionDiaryWritePage.tsx';
import EmotionDiaryCompletePage from '@pages/EmotionDiaryCompletePage.tsx';
import OverlayManager from '@/processes/overlay/ui/OverlayManager';

export type DiaryStackParamList = {
  EmotionSelectionPage: undefined;
  EmotionDiaryWritePage: undefined;
  Complete: undefined;
  EmotionDetailPage: { origin: string };
};

const Stack = createNativeStackNavigator<DiaryStackParamList>();

const DiaryStack = () => {
  return (
    <>
      <OverlayManager />
      <Stack.Navigator
        initialRouteName="EmotionSelectionPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="SelectEmotion"
          component={EmotionSelectionPage}
        />
        <Stack.Screen
          name="WriteDiary"
          component={EmotionDiaryWritePage}
        />
        <Stack.Screen
          name="Complete"
          component={EmotionDiaryCompletePage}
        />
        <Stack.Screen
          name="DiaryDetail"
          component={EmotionDiaryDetailPage}
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
