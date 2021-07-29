import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as HistoryProvider } from './context/HistoryContext';
import { Provider as MealProvider } from './context/MealContext';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <HistoryProvider>
          <MealProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </MealProvider>
        </HistoryProvider>
      </SafeAreaProvider>
    );
  }
}
