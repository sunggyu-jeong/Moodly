import { Image, Text, TouchableOpacity } from "react-native";
import SettingList from "../components/molecules/SettingList.atom";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { IMAGES } from "../assets/images";

const SettingPage = () => {
  enum SETTING_EVENT_TYPE {
    BACKUP = "backup",
    BUG_REPORT = "bug_report",
  }
  
  const SETTING_LIST_ITEM = [
    {
      title: '앱 버전',
      rightComponent: <Text className="font-semibold text-lg">1.0.0</Text>,
    },
    {
      title: '백업',
      rightComponent: (<Image source={IMAGES.right} />),
      onPress: () => handlePress(SETTING_EVENT_TYPE.BACKUP),
    },
    {
      title: '버그 제보하기/건의사항',
      rightComponent: (<Image source={IMAGES.right} />),
      onPress: () => handlePress(SETTING_EVENT_TYPE.BUG_REPORT),
    },
  ]

  const handlePress = (identifier: SETTING_EVENT_TYPE) => {
    if (identifier === SETTING_EVENT_TYPE.BACKUP) {
      console.log("백업하기");
    } else if (identifier === SETTING_EVENT_TYPE.BUG_REPORT)  {
      console.log("버그 제보하기");
    }
  }

  return (
    <>
      <NavigationBarOrga showBackButton={false} title="설정" />
      <SettingList items={SETTING_LIST_ITEM} />
    </>
  )
}

export default SettingPage;