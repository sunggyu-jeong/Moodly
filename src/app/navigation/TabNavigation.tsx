import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DiaryList from '@/features/diary/ui/screen/DiaryList';
import Home from '@/features/home/ui/screen/Home';
import Setting from '@/features/setting/ui/screen/Setting';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks';
import TabBarIcon from '@/shared/ui/elements/TabBarIcon';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: getScaleSize(49) + insets.bottom,
            paddingBottom: 0,
            backgroundColor: 'white',
          },
          tabBarItemStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="홈"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={focused ? MAIN_ICONS.homeActive : MAIN_ICONS.homeInactive}
              />
            ),
          }}
        />
        <Tab.Screen
          name="일기목록"
          component={DiaryList}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={focused ? MAIN_ICONS.listActive : MAIN_ICONS.listInactive}
              />
            ),
          }}
        />
        <Tab.Screen
          name="설정"
          component={Setting}
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
