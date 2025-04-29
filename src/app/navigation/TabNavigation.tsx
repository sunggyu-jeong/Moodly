import TabBarIcon from '@/components/atoms/TabBarIcon';
import { getScaleSize } from '@/hooks';
import DiaryList from '@/pages/DiaryList';
import Home from '@/pages/Home';
import Setting from '@/pages/Setting';
import { IMAGES } from '@/shared/assets/images';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: getScaleSize(49) + insets.bottom,
            paddingBottom: 0,
            backgroundColor: 'white',
          },
        }}
      >
        <Tab.Screen
          name="홈"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? IMAGES.homeActive : IMAGES.homeInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="일기목록"
          component={DiaryList}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={focused ? IMAGES.bookOpenActive : IMAGES.bookOpenInactive}
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
                source={focused ? IMAGES.settingsActive : IMAGES.settingsInactive}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigation;
