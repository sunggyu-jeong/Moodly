import { Image, Text, View } from 'react-native';

import SettingList from '@/features/setting/ui/SettingList';
import { IMAGES } from '@/shared/assets/images';
import { getScaleSize } from '@/shared/hooks';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

const Setting = () => {
  enum SETTING_EVENT_TYPE {
    BACKUP = 'backup',
    BUG_REPORT = 'bug_report',
  }

  const SETTING_LIST_ITEM = [
    {
      title: '백업',
      rightComponent: <Image source={IMAGES.backup} />,
      onPress: () => handlePress(SETTING_EVENT_TYPE.BACKUP),
    },
    {
      title: '피드백 보내기',
      rightComponent: <Image source={IMAGES.feedbackChat} />,
      onPress: () => handlePress(SETTING_EVENT_TYPE.BUG_REPORT),
    },
  ];

  const handlePress = (identifier: SETTING_EVENT_TYPE) => {
    if (identifier === SETTING_EVENT_TYPE.BACKUP) {
      console.log('백업하기');
    } else if (identifier === SETTING_EVENT_TYPE.BUG_REPORT) {
      console.log('버그 제보하기');
    }
  };

  return (
    <>
      <NavigationBar
        showBackButton={false}
        centerComponent={<NaviTitleDisplay title="설정" />}
      />
      <View
        className="bg-white flex-1"
        style={{ paddingTop: getScaleSize(80) }}
      >
        <SettingList items={SETTING_LIST_ITEM} />
        <Text className="text-center items-center mb-5 font-pretendard font-light text-base">
          앱 버전 : 1.0.0
        </Text>
      </View>
    </>
  );
};

export default Setting;
