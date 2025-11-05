import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import './global.css';

import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import App from './src/app/App';
import { store } from './src/app/store';

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

registerRootComponent(AppWrapper);
