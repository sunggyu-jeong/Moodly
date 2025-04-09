import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStack';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

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
  if (navigationRef.isReady()) {
    const routeNames = navigationRef.getRootState()?.routeNames ?? [];
    const routes = routeNames.filter((r) => r !== '스플래시');
    const rootRoute = routes[0];

    if (rootRoute) {
      navigationRef.dispatch(
        StackActions.popToTop()
      );
    }
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