import { CommonActions, createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStack';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export enum NavigationFlow {
  DiaryDetailToWriteDiaryWithEmotionStack,
  DiaryDetailToEmotionWriteWithReturn,
}

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: RouteName extends unknown
    ? undefined extends RootStackParamList[RouteName]
      ? | [screen: RouteName]| [screen: RouteName, params: RootStackParamList[RouteName]]
      : [screen: RouteName, params: RootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}

export function canGoBack() {
  return navigationRef.isReady() && navigationRef.canGoBack();
}

export function goBack() {
  if (canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetToRoot() {
  if (!navigationRef.isReady()) return;

  const state = navigationRef.getRootState();
  if (state.routes.length > 1) {
    navigationRef.dispatch(StackActions.popToTop());
  }
}

export function resetTo<RouteName extends keyof RootStackParamList>(
  screen: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: screen, params }],
    });
  }
}

export function dismissModalToScreen() {
  console.log(">>>>asdf")
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.dispatch(StackActions.popToTop());
    navigationRef.goBack();
  } else {
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  }
}

export function navigateFlow(flow: NavigationFlow) {
  if (!navigationRef.isReady()) return;

  switch (flow) {
    case NavigationFlow.DiaryDetailToEmotionWriteWithReturn:
      const rootState = navigationRef.getRootState();
      const newRoutes = [...rootState.routes];
      
      navigationRef.reset({
        index: newRoutes.length,
        routes: [
          ...newRoutes,
          {
            name: "DiaryStack",
            state: {
              index: 1,
              routes: [
                { name: "SelectEmotion" },
                { name: "WriteDiary" },
              ],
            },
          } as any,
        ],
      });
      break;
    default:
      break;
  }
}