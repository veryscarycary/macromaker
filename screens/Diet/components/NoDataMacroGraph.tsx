import React from 'react';
import { View, Text } from '../../../components/Themed';
import { StyleSheet, Dimensions } from 'react-native';

// Retrieve initial screen's width
const screenWidth = Dimensions.get('window').width;

const NoDataMacroGraph = () => (
  <View style={styles.graph}>
    <Text>No Data</Text>
  </View>
);

const styles = StyleSheet.create({
  graph: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderRadius: 100,
    width: screenWidth/2.5,
    height: screenWidth/2.5,
    position: 'absolute',
    left: 20,
    top: 20,
  },
});

export default NoDataMacroGraph;
