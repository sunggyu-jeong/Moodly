import DiaryListPage from "../pages/diary-list.page";
import HomePage from "../pages/home.page";
import SettingPage from "../pages/setting.page";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/atoms/TabBarIcon.atom";
import { IMAGES } from "../assets/images";
import { useScale } from "../hooks";

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
      }}>
      <Tab.Screen 
        name="홈" 
        component={HomePage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? IMAGES.homeActive : IMAGES.homeInactive} />
          ),
        }}
      />
      <Tab.Screen 
        name="일기목록" 
        component={DiaryListPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? IMAGES.bookOpenActive : IMAGES.bookOpenInactive} />
          ),
        }}
      />
      <Tab.Screen 
        name="설정" 
        component={SettingPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? IMAGES.settingsActive : IMAGES.settingsInactive} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigation;