import React from 'react';
import { Text, View, Button } from 'react-native';
import NavigationBarOrga from '../components/organisms/NavigationBar.orga';
import { navigate } from '@/utils';

const PushTestPage = () => {
  const navigationBarConfig = {
    title: "푸시 테스트화면",
  }

  return (
    <>
      <NavigationBarOrga {...navigationBarConfig} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>푸시 테스트 페이지</Text>
        <Button title="메인화면으로 이동" onPress={() => navigate("메인화면")} />
      </View>
    </>
  );
};

export default PushTestPage;                                                                                                                                                                                                                                                                                                          