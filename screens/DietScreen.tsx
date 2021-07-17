import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import { Text, View } from '../components/Themed';

import PercentageSlider from '../components/PercentageSlider';

const DietScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/images/diet-background.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <Text style={styles.title}>Macros</Text>

      <PercentageSlider label="Carbs" style={styles.marginTop} />
      <PercentageSlider label="Protein" style={styles.marginTop} />
      <PercentageSlider label="Fat" style={styles.marginTop} />
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
  title: {
    fontSize: 32,
    fontFamily: 'helvetica',
    fontWeight: 'bold',
  },
  marginTop: {
    marginTop: 15,
  },
});

export default DietScreen;
