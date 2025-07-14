import { useCallback, useMemo, version } from 'react';
import { View } from 'react-native';
import { useLogout } from '../features/auth/hooks/useLogout';
import SettingList from '../features/setting/ui/SettingList';
import { common, gray } from '../shared/styles/colors';
import NaviTitleDisplay from '../shared/ui/elements/NaviTitle';
import { Label } from '../shared/ui/typography/Label';
import NavigationBar from '../widgets/navigation-bar/ui/NavigationBar';
import { SETTING_EVENT_TYPE } from '../features/setting/types';

const ManageAccountPage = () => {
  const { signOut } = useLogout();
  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      if (identifier === SETTING_EVENT_TYPE.LOG_OUT) {
        signOut();
      } else if (identifier === SETTING_EVENT_TYPE.DELETE_ACCOUNT) {
        console.log('계정삭제');
      }
    },
    [signOut]
  );

  const settingListItems = useMemo(
    () => [
      {
        key: 'log-out',
        title: '로그아웃',
        onPress: () => handlePress(SETTING_EVENT_TYPE.LOG_OUT),
      },
      {
        key: 'delete-account',
        title: '계정 삭제',
        titleStyle: { color: common.red },
      },
    ],
    [handlePress]
  );

  return (
    <>
      <NavigationBar
        backgroundColor={gray[100]}
        showBackButton={false}
        centerComponent={<NaviTitleDisplay title={'계정 관리'} />}
      />
      <View className="bg-gray-100 flex-1 justify-between px-4 rounded-xl pt-[14px]">
        <SettingList items={settingListItems} />
        <Label
          weight="regular"
          className="text-gray-400 mb-[13px] text-center"
        >
          {'앱 버전: ' + version}
        </Label>
      </View>
    </>
  );
};

export default ManageAccountPage;
