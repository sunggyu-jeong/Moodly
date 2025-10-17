import EmotionDiaryListPage from '@/pages/EmotionDiaryListPage';
import HomePage from '@/pages/HomePage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { TabBarIcon, useScale } from '@/shared';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SettingStack, { type SettingStackParamList } from './SettingStack';

export type BottomTabParamList = {
  Home: undefined;
  DiaryList: undefined;
  SettingStack: NavigatorScreenParams<SettingStackParamList>;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigation = () => {
  const insets = useSafeAreaInsets();
  const { getScaleSize } = useScale();

  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: getScaleSize(49) + insets.bottom,
            paddingBottom: 0,
            backgroundColor: '#ffffff',
            elevation: 0,
          },
          tabBarItemStyle: {
            justifyContent: 'flex-start',
            paddingTop: getScaleSize(4),
            paddingBottom: insets.bottom ? insets.bottom : getScaleSize(8),
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.homeActive : MAIN_ICONS.homeInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="DiaryList"
          component={EmotionDiaryListPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.listActive : MAIN_ICONS.listInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingStack"
          component={SettingStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={focused ? MAIN_ICONS.settingsActive : MAIN_ICONS.settingsInactive}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigation;
