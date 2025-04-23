import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IMAGES } from '../assets/images';
import TabBarIcon from '../components/atoms/TabBarIcon.atm';
import { useScale } from '../hooks';
import DiaryList from '../pages/DiaryList.pge';
import Home from '../pages/Home.pge';
import Setting from '../pages/Setting.pge';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const { getScaleSize } = useScale();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: getScaleSize(102),
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
  );
};

export default TabNavigation;
