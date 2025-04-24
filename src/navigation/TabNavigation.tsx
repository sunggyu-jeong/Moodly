import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../assets/images';
import TabBarIcon from '../components/atoms/TabBarIcon.atm';
import { getScaleSize } from '../hooks';
import DiaryList from '../pages/DiaryList.pge';
import Home from '../pages/Home.pge';
import Setting from '../pages/Setting.pge';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['bottom']}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: getScaleSize(49),
            paddingBottom: insets.bottom,
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
    </SafeAreaView>
  );
};

export default TabNavigation;
