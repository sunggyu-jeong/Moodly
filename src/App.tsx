import "../global.css"
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { navigationRef } from "./utils";
import { Provider } from "react-redux";
import 'react-native-get-random-values';
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}