import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../Themed';

const HorizontalBarContainer = ({ label }: { label: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.macroLabel}>
        <Text style={styles.title}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 40,
    backgroundColor: '#bbb',
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
});

export default HorizontalBarContainer;
