import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AIReportPage from '@/pages/AIReportPage';
import EmotionDiaryListPage from '@/pages/EmotionDiaryListPage';
import HomePage from '@/pages/HomePage';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useScale } from '@/shared/hooks/useScale';
import TabBarIcon from '@/shared/ui/elements/TabBarIcon';

import SettingStack, { type SettingStackParamList } from './SettingStack';

export type BottomTabParamList = {
  Home: undefined;
  DiaryList: undefined;
  AIReport: undefined;
  SettingStack: NavigatorScreenParams<SettingStackParamList>;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigation = () => {
  const insets = useSafeAreaInsets();
  const { getScaleSize } = useScale();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: getScaleSize(49) + insets.bottom,
            paddingBottom: 0,
            backgroundColor: '#ffffff',
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: getScaleSize(11),
            fontWeight: 400,
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
            tabBarLabel: '홈',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.homeActive : MAIN_ICONS.homeInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="DiaryList"
          component={EmotionDiaryListPage}
          options={{
            tabBarLabel: '목록',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.listActive : MAIN_ICONS.listInactive} />
            ),
          }}
        />
        <Tab.Screen
          name="AIReport"
          component={AIReportPage}
          options={{
            tabBarLabel: '리포트',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon source={focused ? MAIN_ICONS.reportActive : MAIN_ICONS.reportInactive} />
            ),
          }}
        />

        <Tab.Screen
          name="SettingStack"
          component={SettingStack}
          options={{
            tabBarLabel: '설정',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabNavigation;
