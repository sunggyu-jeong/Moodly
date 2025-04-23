import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryDetail from '../pages/DiaryDetail.pge';
import SelectEmotion from '../pages/SelectEmotion.pge';
import WriteDiary from '../pages/WriteDiary.pge';
import WriteDiaryComplete from '../pages/WriteDiaryComplete.pge';

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
        />
      </Stack.Navigator>
    </>
  );
};

export default DiaryStack;
