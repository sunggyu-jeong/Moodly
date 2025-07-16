import { KAKAO_OPEN_CHAT_LINK } from '@env';
import { useLogout } from '@features/auth/hooks/useLogout';
import { SETTING_EVENT_TYPE, TEXTS } from '@features/setting/types';
import SettingRoot from '@features/setting/ui/SettingRoot';
import { SocialLoginSheet, SocialLoginSheetHandle } from '@features/setting/ui/SocialLoginSheet';
import { COMMON_ICONS } from '@shared/assets/images/common';
import { useOpenKakao } from '@shared/hooks/useOpenChat';
import { navigate } from '@shared/lib';
import { supabase } from '@shared/lib/supabase.util';
import ActionButton from '@shared/ui/elements/ActionButton';
import Toggle from '@shared/ui/elements/Toggle';
import { Body1 } from '@shared/ui/typography/Body1';
import { Label } from '@shared/ui/typography/Label';
import { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState, version } from 'react';
import { Image, View } from 'react-native';

const SettingPage = () => {
  const { openChat } = useOpenKakao();
  const { signOut } = useLogout();
  const [isOn, setIsOn] = useState(false);
  const [userInfo, setUserInfo] = useState<Session | null>(null);
  const socialSheetRef = useRef<SocialLoginSheetHandle>(null);

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setUserInfo(data.session);
    }
    fetchSession();
  }, []);

  const handlePress = useCallback(
    (type: SETTING_EVENT_TYPE) => {
      switch (type) {
        case SETTING_EVENT_TYPE.MANAGE_ACCOUNT:
          navigate('Main', {
            screen: 'Setting',
            params: { screen: 'ManageAccount' },
          });
          break;
        case SETTING_EVENT_TYPE.SEND_FEEDBACK:
          openChat(KAKAO_OPEN_CHAT_LINK);
          break;
        case SETTING_EVENT_TYPE.LOG_OUT:
          signOut();
          break;
        default:
          break;
      }
    },
    [openChat, signOut]
  );

  const headerItem = userInfo
    ? {
        leftComponent: (
          <View className="flex-col">
            <Body1 weight="semibold">{userInfo.user.user_metadata.full_name}</Body1>
            <Label weight="regular">{userInfo.user.email}</Label>
          </View>
        ),
      }
    : {
        leftComponent: (
          <View className="flex justify-between gap-4">
            <View className="flex-col mr-3">
              <Body1 weight="semibold">{TEXTS.guestTitle}</Body1>
              <Label weight="regular">{TEXTS.guestLabel}</Label>
            </View>
            <ActionButton onPress={() => socialSheetRef.current?.expand()}>
              {TEXTS.loginButton}
            </ActionButton>
          </View>
        ),
      };

  const settingListItems = [
    ...(userInfo
      ? [
          {
            title: TEXTS.accountManagement,
            onPress: () => handlePress(SETTING_EVENT_TYPE.MANAGE_ACCOUNT),
          },
        ]
      : []),
    {
      title: TEXTS.notificationSettings,
      onPress: () => setIsOn(prev => !prev),
      rightComponent: (
        <Toggle
          isOn={isOn}
          onToggle={() => setIsOn(p => !p)}
        />
      ),
    },
    {
      title: TEXTS.feedback,
      onPress: () => handlePress(SETTING_EVENT_TYPE.SEND_FEEDBACK),
      rightComponent: (
        <Image
          source={COMMON_ICONS.iconNextGray}
          className="w-6 h-6"
          accessibilityLabel="의견 보내기"
        />
      ),
    },
  ];

  return (
    <>
      <SettingRoot
        headerItem={headerItem}
        settingItems={settingListItems}
        version={version}
      />
      <SocialLoginSheet ref={socialSheetRef} />
    </>
  );
};

export default SettingPage;
