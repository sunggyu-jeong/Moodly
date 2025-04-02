import "../global.css"
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { navigationRef } from "./utils";
import { RealmProvider } from "./provider/RealmProvider";
import 'react-native-get-random-values';

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RealmProvider>
        <RootStack />
      </RealmProvider>
    </NavigationContainer>
  );
}