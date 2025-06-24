/**
 * @format
 */
import { AppRegistry } from 'react-native';
import 'react-native-url-polyfill/auto';

import App from './src/app/App';
import { name as appName } from './src/shared/config/app.json';

AppRegistry.registerComponent(appName, () => App);
