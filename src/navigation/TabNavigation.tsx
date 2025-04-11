import DiaryListPage from "../pages/diary-list.page";
import HomePage from "../pages/home.page";
import SettingPage from "../pages/setting.page";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/atoms/TabBarIcon.atom";
import { IMAGES } from "../assets/images";
import DiaryDetailPage from "../pages/diary-detail.page";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 102,
        },
      }}>
      <Tab.Screen 
        name="홈" 
        component={DiaryDetailPage}
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