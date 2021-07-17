import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { Text, View } from './Themed';


const handlePercentageChange = (
  value: number,
  setValue: (value: string) => void
) => {
  const rounded = Math.round(value);
  setValue(`${rounded}%`);
};


const PercentageSlider = ({ label, style }: { label: string, style: Object }) => {
  const [percentage, setPercentage] = useState('0%');

  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.macroLabel}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.title}>{percentage}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#9091b4"
        onValueChange={(value) => handlePercentageChange(value, setPercentage)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  macroLabel: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {},
});

export default PercentageSlider;