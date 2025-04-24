import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import '../global.css';
import OverlayManager from './manager/OverlayManager';
import RootStack from './navigation/RootStack';
import store from './redux/store';
import { navigationRef } from './utils';

dayjs.locale('ko');

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
