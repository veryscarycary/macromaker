import 'react-native-gesture-handler'; // MUST be at the top
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json'; // this should exist

AppRegistry.registerComponent(appName, () => App);
