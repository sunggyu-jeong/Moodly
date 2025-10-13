import EmotionDiaryCompletePage from '@/pages/EmotionDiaryCompletePage';
import EmotionDiaryDetailPage from '@/pages/EmotionDiaryDetailPage';
import EmotionDiaryWritePage from '@/pages/EmotionDiaryWritePage';
import EmotionSelectionPage from '@/pages/EmotionSelectionPage';
import OverlayManager from '@/processes/overlay/ui/OverlayManager';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

export type DiaryStackParamList = {
  EmotionSelectionPage: undefined;
  EmotionDiaryWritePage: undefined;
  Complete: undefined;
  EmotionDetailPage: { origin: string };
};

const Stack = createNativeStackNavigator<DiaryStackParamList>();

const DiaryStack = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="EmotionSelectionPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="EmotionSelectionPage"
          component={EmotionSelectionPage}
        />
        <Stack.Screen
          name="EmotionDiaryWritePage"
          component={EmotionDiaryWritePage}
        />
        <Stack.Screen
          name="Complete"
          component={EmotionDiaryCompletePage}
        />
        <Stack.Screen
          name="EmotionDetailPage"
          component={EmotionDiaryDetailPage}
          initialParams={{ origin: 'DiaryStack' }}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
      {/* <OverlayManager /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DiaryStack;
