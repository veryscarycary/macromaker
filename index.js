import 'react-native-gesture-handler'; // MUST be at the top
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json'; // this should exist

enableScreens(false);

AppRegistry.registerComponent(appName, () => App);
