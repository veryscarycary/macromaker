import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // fonts are bundled automatically in modern RN, nothing to load
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
