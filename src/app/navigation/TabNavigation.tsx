import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmotionDiaryListPage from '@pages/EmotionDiaryListPage.tsx';
import HomePage from '@pages/HomePage.tsx';
import SettingPage from '@pages/SettingPage.tsx';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useScale } from '@/shared/hooks';
import TabBarIcon from '@/shared/ui/elements/TabBarIcon';

export type BottomTabParamList = {
  홈: undefined;
  일기목록: undefined;
  설정: undefined;
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
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="홈"
          component={HomePage}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.homeActive : MAIN_ICONS.homeInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="일기목록"
          component={EmotionDiaryListPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.listActive : MAIN_ICONS.listInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="설정"
          component={SettingPage}
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
