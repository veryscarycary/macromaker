import * as React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { useContext } from 'react';

import { Text } from '../design/components';
import { Context as InfoContext } from '../context/InfoContext';
import PercentageSlider from '../components/PercentageSlider';

const MacroScreen = () => {
  const {
    state: { targetCarbsPercentage, targetProteinPercentage, targetFatPercentage },
    setInfoState,
  } = useContext(InfoContext);

  return (
    <ImageBackground
      source={require('../assets/images/diet-background.png')}
      resizeMode="cover"
      style={styles.container}
    >
      {/* Note: MacroScreen not found in current navigation stack; migrated for completeness. */}
      <Text variant="display">Macros</Text>

      <PercentageSlider label="Carbs" style={styles.marginTop} value={targetCarbsPercentage} setValue={(v) => setInfoState({ targetCarbsPercentage: v })} />
      <PercentageSlider label="Protein" style={styles.marginTop} value={targetProteinPercentage} setValue={(v) => setInfoState({ targetProteinPercentage: v })} />
      <PercentageSlider label="Fat" style={styles.marginTop} value={targetFatPercentage} setValue={(v) => setInfoState({ targetFatPercentage: v })} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 200,
  },
  marginTop: {
    marginTop: 15,
  },
});

export default MacroScreen;
