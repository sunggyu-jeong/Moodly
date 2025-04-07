import { resetTo } from "../utils";
import { useEffect } from "react";
import { Text, View } from "react-native";

const SplashPage = () => {

  useEffect(() => {
    setTimeout(() => {
      resetTo("메인화면");
    }, 2000);
  }, [])
  
  return (
    <View className="bg-slate-50 flex-1 justify-center items-center">
      <View style={{ marginTop: -33 }}>
        <Text
          className="text-pretendard font-bold text-[44px] tracking-[-0.5px] text-center"
          style={{ marginBottom: 22 }}
        >
          Moodly
        </Text>
        <Text className="text-[#606060] font-pretendard font-medium text-base tracking-[-0.5px] text-center align-middle">
          귀여운 감정 친구들과 함께, 하루를 기록해봐요
        </Text>
      </View>
    </View>
  );
};

export default SplashPage;