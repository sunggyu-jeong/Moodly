import { Button, Text, View } from "react-native";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { useEffect } from "react";
import { useAppSelector, useRealm } from "../hooks";
import { addDiaryThunk, searchDiaryByMonthThunk } from "../redux/slice/diarySlice";
import { useAppDispatch } from "../hooks";
import { EmotionDiaryDTO } from "../scheme";

const HomePage = () => {
  const { realm } = useRealm();
  const dispatch = useAppDispatch();
  const emotionDiaryList = useAppSelector((state) => state.diarySlice.emotionDiaryList);
  const navigationBarConfig = {
    title: "홈화면"  
  };
  const exampleDiaryDTO: EmotionDiaryDTO = {  
    userId: 101,           
    iconId: 3,             
    recordDate: new Date(),
    description: "오늘은 기분이 좋았다!",
  };

  useEffect(() => {
    console.log(">>>>>>>>>>>>>>>> REALM 데이터 조회", emotionDiaryList)
  }, [emotionDiaryList])

  return (
    <>
      <NavigationBarOrga {...navigationBarConfig} />
      <View className="justify-center items-center">
        <Text>Home Screen</Text>
        <Button
          title="감정기록 추가 테스트"
          onPress={() => {
            if (realm) {
              dispatch(addDiaryThunk({ realm, data: exampleDiaryDTO }));
            } else {
              console.error("Realm is null. Cannot add diary.");
            }
          }}
        />
        <Button
          title="감정기록 조회 테스트"
          onPress={() => {
            if (realm) {
              dispatch(searchDiaryByMonthThunk({ realm, recordDate: new Date()}));
            } else {
              console.error("Realm is null. Cannot add diary.");
            }
          }}
        />
      </View>
    </>
  )
}

export default HomePage;