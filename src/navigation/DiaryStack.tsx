import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryDetailPage from '../pages/diary-detail.page';
import SelectEmotionPage from '../pages/select-emotion.page';
import WriteDiaryCompletePage from '../pages/write-diary-complete.page';
import WriteDiaryPage from '../pages/write-diary.page';

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
      <Stack.Navigator
        initialRouteName="SelectEmotion"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="SelectEmotion"
          component={SelectEmotionPage}
        />
        <Stack.Screen
          name="WriteDiary"
          component={WriteDiaryPage}
        />
        <Stack.Screen
          name="Complete"
          component={WriteDiaryCompletePage}
        />
        <Stack.Screen
          name="DiaryDetail"
          component={DiaryDetailPage}
          initialParams={{ origin: 'DiaryStack' }}
        />
      </Stack.Navigator>
    </>
  );
};

export default DiaryStack;
