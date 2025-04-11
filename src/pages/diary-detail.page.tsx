import NaviMore from "../components/atoms/NaviMore.atom";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { Image, ScrollView, Text } from "react-native";
import { NaviActionButtonAtomProps } from "../components/atoms/NaviActionButton.atom";
import { IMAGES } from "../assets/images";
import { useScale } from "../hooks";

const DiaryDetailPage = () => {
  const { getScaleSize } = useScale();
  const actionButtons: NaviActionButtonAtomProps[] = [{
    item: <NaviMore />,
    disabled: false,
    onPress: () => {
      console.log('Edit button pressed');
    },
  }]

  return (
    <>
      <NavigationBarOrga showBackButton={false} actionButtons={actionButtons} />
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerStyle={{
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        
        <Image 
          source={IMAGES.smile} 
          className="mt-[37px]"
          style={{ width: getScaleSize(137), height: getScaleSize(137) }}
        />
        <Text
          className="font-pretendard font-medium text-center tracking-[-0.5px] mx-6 leading-[30px]"
          style={{ marginTop: getScaleSize(34), fontSize: getScaleSize(18) }}>
            마음이 조금 복잡한 하루였어. 별일은 아니었는데 계속 생각이 나고, 괜히 긴장되고 초조했던 것 같아. 무슨 이유 때문인지는 딱히 모르겠는데, 머릿속이 자꾸 시끄러워지는 그런 날. 그래도 이렇게 글로 남기고 나니까 마음이 조금은 가벼워진 느낌이야. 지금 이 순간을 잘 지나가면 괜찮아질 거라는 그런 작은 믿음도 조금 생겼어.
        </Text>
      </ScrollView>
    </>    
  )
}

export default DiaryDetailPage;