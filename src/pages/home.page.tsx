import React from "react";
import { Text, View } from "react-native";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";

const HomePage = () => {
  const navigationBarConfig = {
    title: "홈화면"  
  };

  return (
    <>
      <NavigationBarOrga {...navigationBarConfig} />
      <View className="justify-center items-center">
        <Text>Home Screen</Text>
      </View>
    </>
  )
}

export default HomePage;