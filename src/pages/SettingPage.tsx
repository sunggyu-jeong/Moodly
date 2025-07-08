import { KAKAO_OPEN_CHAT_LINK } from '@env';
import { useCallback, useEffect, useMemo } from 'react';
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

enum SETTING_EVENT_TYPE {
  BACKUP = 'backup',
  BUG_REPORT = 'bug_report',
}

const SettingPage = () => {
  const { openChat } = useOpenKakao();
  const [signOut, { data, isLoading }] = useSignOutMutation();
  const dispatch = useAppDispatch();
  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      if (identifier === SETTING_EVENT_TYPE.BACKUP) {
        signOut();
      } else if (identifier === SETTING_EVENT_TYPE.BUG_REPORT) {
        openChat(KAKAO_OPEN_CHAT_LINK);
      }
    },
    [openChat]
  );

  useEffect(() => {
    if (isLoading) return;

    if (isNotEmpty(data) && data.data === 'success') {
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
      // MVP SPEC OUT
      {
        title: '의견 보내기',
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconFeedback}
            style={styles.iconStyle}
          />
        ),
        onPress: () => handlePress(SETTING_EVENT_TYPE.BUG_REPORT),
      },
      {
        title: '로그아웃',
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconBackup}
            style={styles.iconStyle}
          />
        ),
        onPress: () => handlePress(SETTING_EVENT_TYPE.BACKUP),
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
  iconStyle: {
    height: getScaleSize(24),
    tintColor: gray[400],
    width: getScaleSize(24),
  },
  versionLabel: {
    color: gray[400],
    marginBottom: getScaleSize(13),
    textAlign: 'center',
  },
});

export default SettingPage;
