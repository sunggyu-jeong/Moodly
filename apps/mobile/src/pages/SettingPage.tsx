import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useGetUserInfoQuery } from '@/entities/auth/api';
import { MODAL_CONFIRM_ACTION_KEY } from '@/entities/overlay/model/types';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { SETTING_EVENT_TYPE, TEXTS } from '@/features/setting/types';
import SettingRoot from '@/features/setting/ui/SettingRoot';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import useDelay from '@/shared/hooks/useDelay';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { useExternalWebSite } from '@/shared/hooks/useOpenChat';
import { navigate } from '@/shared/lib/navigation.util';
import { isNotEmpty } from '@/shared/lib/value.util';
import { setShowModalPopup } from '@/shared/model/overlaySlice';
import { gray } from '@/shared/styles/colors';
import Toggle from '@/shared/ui/elements/Toggle';
import { Body1 } from '@/shared/ui/typography/Body1';
import { Label } from '@/shared/ui/typography/Label';

const SettingPage = () => {
  const { openLink } = useExternalWebSite();
  const { signOut } = useLogout();
  const dispatch = useAppDispatch();
  const { data: userInfo, isLoading } = useGetUserInfoQuery();
  const [notificationStatus, setNotificationStatus] = useState<Notifications.PermissionStatus>(
    Notifications.PermissionStatus.UNDETERMINED,
  );

  useEffect(() => {
    const checkNotificationStatus = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationStatus(status);
      } catch (error) {
        console.error('알림 권한 확인 중 오류 발생:', error);
      }
    };
    checkNotificationStatus();
  }, []);

  const handlePress = useCallback(
    (type: SETTING_EVENT_TYPE) => {
      switch (type) {
        case SETTING_EVENT_TYPE.MANAGE_ACCOUNT:
          navigate('Main', {
            screen: 'SettingStack',
            params: { screen: 'ManageAccount' },
          });
          break;
        case SETTING_EVENT_TYPE.SEND_FEEDBACK:
          openLink(process.env.EXPO_PUBLIC_KAKAO_OPEN_CHAT_LINK);
          break;
        case SETTING_EVENT_TYPE.LOG_OUT:
          signOut();
          break;
        case SETTING_EVENT_TYPE.PRIVACY_POLICY:
          openLink(process.env.EXPO_PUBLIC_PRIVACY_POLICY_LINK);
          break;
        case SETTING_EVENT_TYPE.TERMS_OF_SERVICE:
          openLink(process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_LINK);
          break;
        default:
          break;
      }
    },
    [openLink, signOut],
  );

  const headerItem = isNotEmpty(userInfo)
    ? {
        key: 'user-info',
        leftComponent: (
          <TouchableOpacity onPress={() => handlePress(SETTING_EVENT_TYPE.MANAGE_ACCOUNT)}>
            <View style={styles.headerRow}>
              <View style={styles.headerCol}>
                <Body1
                  weight="semibold"
                  style={styles.text}
                >
                  {userInfo.nickname}
                </Body1>
                <Label
                  weight="regular"
                  style={styles.text}
                >
                  {userInfo.email}
                </Label>
              </View>
              <Image
                source={COMMON_ICONS.iconNextGray}
                style={styles.icon}
                accessibilityLabel="의견 보내기"
              />
            </View>
          </TouchableOpacity>
        ),
      }
    : {
        key: 'empty',
        leftComponent: <></>,
      };

  const settingListItems = [
    [
      {
        key: 'notification',
        title: TEXTS.notificationSettings,
        rightComponent: (
          <Toggle
            isOn={notificationStatus === Notifications.PermissionStatus.GRANTED}
            onToggle={() =>
              dispatch(
                setShowModalPopup({
                  visibility: true,
                  title: '알림 설정 변경',
                  message: '알림을 변경하려면 설정 앱으로 이동해 주세요',
                  cancelText: '나중에 하기',
                  confirmText: '설정하기',
                  confirmActionKey: MODAL_CONFIRM_ACTION_KEY.PERMISSION_CHANGE,
                }),
              )
            }
          />
        ),
      },
    ],
    [
      {
        key: 'feedback',
        title: TEXTS.feedback,
        onPress: () => handlePress(SETTING_EVENT_TYPE.SEND_FEEDBACK),
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            style={{ width: 24, height: 24 }}
            accessibilityLabel="의견 보내기"
          />
        ),
      },
    ],
    [
      {
        key: 'privacy',
        title: TEXTS.privacyPolicy,
        onPress: () => handlePress(SETTING_EVENT_TYPE.PRIVACY_POLICY),
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            style={{ width: 24, height: 24 }}
            accessibilityLabel="개인정보 처리방침"
          />
        ),
      },
      {
        key: 'terms',
        title: TEXTS.termsOfService,
        onPress: () => handlePress(SETTING_EVENT_TYPE.TERMS_OF_SERVICE),
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            style={{ width: 24, height: 24 }}
            accessibilityLabel="이용약관"
          />
        ),
      },
    ],
  ];

  return (
    <SettingRoot
      headerItem={headerItem}
      settingItems={settingListItems}
      isLoading={useDelay(isLoading) ?? false}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: gray[500],
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCol: {
    flexDirection: 'column',
    gap: 8,
  },
});

export default SettingPage;
