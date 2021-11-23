import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text, View } from './Themed';


const convertToWholePercent = (decimal: number) => Math.round(decimal * 100);

type Props = {
  label: string,
  style?: ViewStyle,
  value: number,
  setValue: (value: number) => void,
  minTrackColor?: string,
  maxTrackColor?: string,
  thumbColor?: string,
};

const PercentageSlider = ({
  label,
  style,
  value,
  setValue,
  minTrackColor = '#000',
  maxTrackColor = '#000',
  thumbColor = '#9091b4',
}: Props) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.macroLabel}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.title}>{convertToWholePercent(value)}%</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={minTrackColor}
        maximumTrackTintColor={maxTrackColor}
        thumbTintColor={thumbColor}
        onValueChange={setValue}
        value={value}
      />
    </View>
  );
};

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