import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { version } from '../../package.json';

import { KAKAO_OPEN_CHAT_LINK } from '@env';
import { useLogout } from '@features/auth/hooks/useLogout';
import SettingList from '@features/setting/ui/SettingList.tsx';
import { COMMON_ICONS } from '@shared/assets/images/common';
import { useOpenKakao } from '@shared/hooks/useOpenChat.ts';
import { resetTo } from '@shared/lib';
import { supabase } from '@shared/lib/supabase.util';
import { gray } from '@shared/styles/colors.ts';
import ActionButton from '@shared/ui/elements/ActionButton';
import NaviTitleDisplay from '@shared/ui/elements/NaviTitle.tsx';
import Toggle from '@shared/ui/elements/Toggle';
import { Body1 } from '@shared/ui/typography/Body1';
import { Label } from '@shared/ui/typography/Label.tsx';
import { Session } from '@supabase/supabase-js';
import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';

enum SETTING_EVENT_TYPE {
  BACKUP = 'backup',
  BUG_REPORT = 'bug_report',
  LOGIN_TEST = 'logn_test',
}

const TEXTS = {
  pageTitle: '설정',
  guestTitle: '게스트',
  guestLabel: '기록한 내용을 저장하려면 로그인이 필요해요.',
  loginButton: '로그인 하기',
  accountManagement: '계정관리',
  notificationSettings: '알림설정',
  feedback: '의견 보내기',
  appVersionPrefix: '앱 버전 : ',
};

const SettingPage = () => {
  const { openChat } = useOpenKakao();
  const { signOut } = useLogout();
  const [isOn, setIsOn] = useState(false);
  const [userInfo, setUserInfo] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserInfo(data.session);
    };
    fetchSession();
  }, []);

  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      if (identifier === SETTING_EVENT_TYPE.BACKUP) {
        signOut();
      } else if (identifier === SETTING_EVENT_TYPE.BUG_REPORT) {
        openChat(KAKAO_OPEN_CHAT_LINK);
      } else if (identifier === SETTING_EVENT_TYPE.LOGIN_TEST) {
        resetTo('Login');
      }
    },
    [openChat, signOut]
  );

  const headerItem = useMemo(() => {
    if (!userInfo) {
      return {
        key: 'guest-header',
        title: '',
        leftComponent: (
          <View className="flex-row items-center justify-between">
            <View className="flex-col mr-3">
              <Body1 weight="semibold">{TEXTS.guestTitle}</Body1>
              <Label weight="regular">{TEXTS.guestLabel}</Label>
            </View>
            <ActionButton onPress={() => resetTo('Login')}>{TEXTS.loginButton}</ActionButton>
          </View>
        ),
      };
    }
    return {
      key: 'user-header',
      title: '',
      leftComponent: (
        <View className="flex-col">
          <Body1 weight="semibold">{userInfo.user.user_metadata.full_name}</Body1>
          <Label weight="regular">{userInfo.user.email}</Label>
        </View>
      ),
    };
  }, [userInfo]);

  const settingListItems = useMemo(
    () => [
      {
        key: 'account-management',
        title: TEXTS.accountManagement,
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
            accessibilityLabel="계정관리 이동"
          />
        ),
        onPress: () => handlePress(SETTING_EVENT_TYPE.BACKUP),
      },
      {
        key: 'notification-settings',
        title: TEXTS.notificationSettings,
        rightComponent: (
          <Toggle
            onToggle={() => setIsOn(prev => !prev)}
            isOn={isOn}
          />
        ),
      },
      {
        key: 'feedback',
        title: TEXTS.feedback,
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
            accessibilityLabel="의견 보내기"
          />
        ),
        onPress: () => handlePress(SETTING_EVENT_TYPE.BUG_REPORT),
      },
    ],
    [handlePress, isOn]
  );

  const items = [headerItem, ...settingListItems];

  return (
    <>
      <NavigationBar
        backgroundColor={gray[100]}
        showBackButton={false}
        centerComponent={<NaviTitleDisplay title={TEXTS.pageTitle} />}
      />
      <View className="bg-gray-100 flex-1 justify-between px-4 rounded-xl pt-[45px]">
        <SettingList items={items} />
        <Label
          weight="regular"
          className="text-gray-400 mb-[13px] text-center"
        >
          {TEXTS.appVersionPrefix + version}
        </Label>
      </View>
    </>
  );
};

export default SettingPage;
