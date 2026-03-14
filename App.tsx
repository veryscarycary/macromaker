import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as HistoryProvider } from './context/HistoryContext';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import BootSplash from 'react-native-bootsplash';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
// TEMPORARY — for font smoke test only (05-03)
import { FontSmokeTestScreen } from './screens/FontSmokeTestScreen';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  if (!isLoadingComplete) {
    return null;
  } else {
    // TEMPORARY — show smoke test screen instead of normal navigation (05-03)
    return <FontSmokeTestScreen />;
  }
}
