/**
 * @format
 */
import 'react-native-url-polyfill/auto';
import './global.css';

import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import App from './src/app/App';
import store from './src/app/store';
import { name as appName } from './src/shared/config/app.json';

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <App />
  </Provider>
));
