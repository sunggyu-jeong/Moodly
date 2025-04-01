import React from 'react';
import "../global.css"
import { NavigationContainer } from '@react-navigation/native';

import RootStack from './navigation/RootStack';


export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}