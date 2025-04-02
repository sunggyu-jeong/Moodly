import React from 'react';
import "../global.css"
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { navigationRef } from './utils/navigation.util';

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack />
    </NavigationContainer>
  );
}