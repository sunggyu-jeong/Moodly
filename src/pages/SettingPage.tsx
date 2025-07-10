import { KAKAO_OPEN_CHAT_LINK } from '@env';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { COMMON_ICONS } from '@shared/assets/images/common';
import { getScaleSize, useAppDispatch } from '@shared/hooks';
import { useOpenKakao } from '@shared/hooks/useOpenChat.ts';
import { gray } from '@shared/styles/colors.ts';
import NaviTitleDisplay from '@shared/ui/elements/NaviTitle.tsx';
import { Label } from '@shared/ui/typography/Label.tsx';
import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';

import SettingList from '@features/setting/ui/SettingList.tsx';
import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { useSignOutMutation } from '@shared/api/auth/authApi.ts';
import { isNotEmpty, resetTo } from '@shared/lib';
import { ApiCode } from '../shared/config/errorCodes';
import ActionButton from '../shared/ui/elements/ActionButton';
import Toggle from '../shared/ui/elements/Toggle';
import { Body1 } from '../shared/ui/typography/Body1';

enum SETTING_EVENT_TYPE {
  BACKUP = 'backup',
  BUG_REPORT = 'bug_report',
  LOGIN_TEST = 'logn_test',
}

const SettingPage = () => {
  const { openChat } = useOpenKakao();
  const [signOut, { data, isLoading }] = useSignOutMutation();
  const dispatch = useAppDispatch();
  const [isOn, setIsOn] = useState(false);
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
    [openChat]
  );

  useEffect(() => {
    if (isLoading) return;

    if (isNotEmpty(data) && data === ApiCode.SUCCESS) {
      dispatch(
        setShowToastView({
          visibility: true,
          message: '로그아웃 요청이 완료되었습니다.',
        })
      );
      resetTo('Login');
    }
  }, [isLoading, data, dispatch]);

  const SETTING_LIST_ITEM = useMemo(
    () => [
      {
        title: '',
        leftComponent: (
          <View className="flex gap-4">
            <View className="gap-2">
              <Body1 weight="semibold">게스트</Body1>
              <Label weight="regular">기록한 내용을 저장하려면 로그인이 필요해요.</Label>
            </View>
            <ActionButton onPress={() => {}}>로그인 하기</ActionButton>
          </View>
        ),
      },
      {
        leftComponent: (
          <View className="flex gap-2">
            <Body1 weight="semibold">성규</Body1>
            <Label weight="regular">moodlydeveloper@gmail.com</Label>
          </View>
        ),
      },
      {
        title: '계정관리',
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
          />
        ),
        // onPress: () => handlePress(SETTING_EVENT_TYPE.BACKUP),
      },
      {
        title: '알림설정',
        rightComponent: (
          <Toggle
            onToggle={() => {
              setIsOn(true);
            }}
            isOn={isOn}
          />
        ),
        // onPress: () => handlePress(SETTING_EVENT_TYPE.LOGIN_TEST),
      },
      {
        title: '의견 보내기',
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
          />
        ),
        onPress: () => handlePress(SETTING_EVENT_TYPE.BUG_REPORT),
      },
    ],
    [handlePress]
  );

  return (
    <>
      <NavigationBar
        backgroundColor={gray[100]}
        showBackButton={false}
        centerComponent={<NaviTitleDisplay title="설정" />}
      />
      <View
        className="bg-gray-100 flex-1 justify-between px-4 rounded-xl"
        style={styles.contentStyle}
      >
        <SettingList items={SETTING_LIST_ITEM} />
        <Label
          weight="regular"
          style={styles.versionLabel}
        >
          앱 버전 : 1.0.0
        </Label>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    paddingTop: getScaleSize(45),
  },
  versionLabel: {
    color: gray[400],
    marginBottom: getScaleSize(13),
    textAlign: 'center',
  },
});

export default SettingPage;
