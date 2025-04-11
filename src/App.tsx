import "../global.css"
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { navigationRef } from "./utils";
import { Provider } from "react-redux";
import 'react-native-get-random-values';
import store from "./redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import 'dayjs/locale/ko'
import dayjs from "dayjs";

dayjs.locale("ko")

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}