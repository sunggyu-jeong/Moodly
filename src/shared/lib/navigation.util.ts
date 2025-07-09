/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
  TabActions,
} from '@react-navigation/native';

import { RootStackParamList } from '@app/navigation/RootStack';

import { BottomTabParamList } from '@app/navigation/TabNavigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export enum NavigationFlow {
  DiaryDetailToCompleteModify,
  DiaryDetailToEmotionWriteWithReturn,
}

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: RouteName extends unknown
    ? undefined extends RootStackParamList[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: RootStackParamList[RouteName]]
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

export function dismiss() {
  if (canGoBack()) {
    navigationRef.dispatch(CommonActions.goBack());
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
  if (!navigationRef.isReady()) return;

  const rootState = navigationRef.getRootState();
  const lastRoute = rootState.routes[rootState.routes.length - 1];

  if (lastRoute.name === 'DiaryStack' && lastRoute.state) {
    const nestedKey = lastRoute.state.key;
    const popToTopAction = StackActions.popToTop();
    navigationRef.dispatch({ ...popToTopAction, target: nestedKey });

    navigationRef.dispatch(CommonActions.goBack());
  }
}

export function navigateFlow(flow: NavigationFlow) {
  if (!navigationRef.isReady()) return;

  switch (flow) {
    case NavigationFlow.DiaryDetailToEmotionWriteWithReturn: {
      const rootState = navigationRef.getRootState();

      const newRoutes = [...rootState.routes];

      navigationRef.reset({
        index: newRoutes.length,
        routes: [
          ...newRoutes,
          {
            name: 'DiaryStack',
            state: {
              index: 1,
              routes: [{ name: 'SelectEmotion' }, { name: 'WriteDiary' }],
            },
          } as any,
        ],
      });
      break;
    }
    case NavigationFlow.DiaryDetailToCompleteModify: {
      if (!navigationRef.isReady()) return;

      const rootState = navigationRef.getRootState();
      const newRoutes = [...rootState.routes].filter(el => el.name !== 'DiaryStack');

      navigationRef.reset({
        index: newRoutes.length,
        routes: [
          ...newRoutes,
          {
            name: 'DiaryStack',
            state: {
              index: 0,
              routes: [{ name: 'DiaryDetail', params: { origin: 'DiaryStack' } }],
            },
          } as any,
        ],
      });
      break;
    }
    default:
      break;
  }
}

export function jumpToTab<RouteName extends keyof BottomTabParamList>(screen: RouteName) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(TabActions.jumpTo(screen as any));
  }
}
