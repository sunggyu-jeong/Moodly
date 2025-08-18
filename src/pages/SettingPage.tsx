import { KAKAO_OPEN_CHAT_LINK } from "@env";
import { useLogout } from "@features/auth";
import { SettingRoot, SocialLoginSheet, SocialLoginSheetHandle } from "@features/setting";
import { SETTING_EVENT_TYPE, TEXTS } from "@features/setting/types";
import { MODAL_CONFIRM_ACTION_KEY } from "@processes/key";
import { setShowModalPopup } from "@processes/overlay/model/overlaySlice";
import { useFocusEffect } from "@react-navigation/native";
import { ActionButton, Body1, Label, Toggle, isEmpty, isNotEmpty, navigate, useAppDispatch, useAppSelector, useGetUserInfoQuery, useNotificationPermission, useOpenKakao } from "@shared";
import { COMMON_ICONS } from "@shared/assets/images/common";
import { useCallback, useEffect, useRef, version } from "react";
import { Image, View } from "react-native";


const SettingPage = () => {
  const { openChat } = useOpenKakao();
  const { signOut } = useLogout();
  const socialSheetRef = useRef<SocialLoginSheetHandle>(null);
  const loginStatus = useAppSelector(state => state.settingSlice.loginStatus);
  const dispatch = useAppDispatch();
  const { status } = useNotificationPermission();
  const { data: userInfo } = useGetUserInfoQuery();



  useFocusEffect(
    useCallback(() => {
      return () => {
        socialSheetRef.current?.close();
      };
    }, []),
  );

  useEffect(() => {
    if (loginStatus === 'REQUEST') {
      socialSheetRef.current?.close();
    }
  }, [loginStatus, dispatch]);

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
          openChat(KAKAO_OPEN_CHAT_LINK);
          break;
        case SETTING_EVENT_TYPE.LOG_OUT:
          signOut();
          break;
        default:
          break;
      }
    },
    [openChat, signOut],
  );

  const headerItem = isNotEmpty(userInfo)
    ? {
        leftComponent: (
          <View className="flex-col">
            <Body1 weight="semibold">{userInfo.nickname}</Body1>
            <Label weight="regular">{userInfo.email}</Label>
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
      rightComponent: (
        <Toggle
          isOn={status === 'granted'}
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
      {isEmpty(userInfo) && <SocialLoginSheet ref={socialSheetRef} />}
    </>
  );
};

export default SettingPage;
