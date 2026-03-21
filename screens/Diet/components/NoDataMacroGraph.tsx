import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Text } from '../../../design/components';
import { colors } from '../../../design/tokens/colors';

// Retrieve initial screen's width
const screenWidth = Dimensions.get('window').width;

const NoDataMacroGraph = () => (
  <View style={styles.graph}>
    <Text variant="bodySmall" color={colors.text.secondary}>
      No Data
    </Text>
  </View>
);

const styles = StyleSheet.create({
  graph: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface.muted,
    borderRadius: 100,
    width: screenWidth / 2.5,
    height: screenWidth / 2.5,
    position: 'absolute',
    left: 20,
    top: 20,
  },
});

export default NoDataMacroGraph;
