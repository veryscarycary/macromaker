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
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <SafeAreaProvider>
            <HistoryProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </HistoryProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }
}
