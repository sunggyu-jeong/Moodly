import { KAKAO_OPEN_CHAT_LINK } from '@env';
import { useCallback, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { COMMON_ICONS } from '@/shared/assets/images/common';
import { getScaleSize } from '@/shared/hooks';
import { useOpenKakao } from '@/shared/hooks/useOpenChat';
import { gray } from '@/shared/styles/colors';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { Label } from '@/shared/ui/typography/Label';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

import SettingList from '../components/SettingList';

enum SETTING_EVENT_TYPE {
  BACKUP = 'backup',
  BUG_REPORT = 'bug_report',
}

const Setting = () => {
  const { openChat } = useOpenKakao();
  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      if (identifier === SETTING_EVENT_TYPE.BACKUP) {
        console.log('백업하기');
      } else if (identifier === SETTING_EVENT_TYPE.BUG_REPORT) {
        openChat(KAKAO_OPEN_CHAT_LINK);
      }
    },
    [openChat]
  );

  const SETTING_LIST_ITEM = useMemo(
    () => [
      {
        title: '백업 및 복원',
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconBackup}
            style={[styles.iconStyle, { tintColor: gray[400] }]}
          />
        ),
        onPress: () => handlePress(SETTING_EVENT_TYPE.BACKUP),
      },
      {
        title: '의견 보내기',
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconFeedback}
            style={[styles.iconStyle, { tintColor: gray[400] }]}
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
        style={{ paddingTop: getScaleSize(45) }}
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
  iconStyle: {
    height: getScaleSize(24),
    width: getScaleSize(24),
  },
  versionLabel: {
    color: gray[400],
    marginBottom: getScaleSize(13),
    textAlign: 'center',
  },
});

export default Setting;
