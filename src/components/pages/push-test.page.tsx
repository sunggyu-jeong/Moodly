import React from 'react';
import { Text, View, Button } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';

type PushTestPageProps = {
  navigation: StackNavigationProp<any>;
};

const PushTestPage = ({ navigation }: PushTestPageProps) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>푸시 테스트 페이지</Text>
      <Button title="메인화면으로 이동" onPress={() => navigation.push('메인화면')} />
    </View>
  );
};

export default PushTestPage;