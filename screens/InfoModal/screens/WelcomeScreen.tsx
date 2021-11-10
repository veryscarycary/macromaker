import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { ModalStackParamList, Navigation } from '../../../types';
import { createStackNavigator } from '@react-navigation/stack';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import Spacer from '../../../components/Spacer';

type Props = {
  navigation: Navigation;
};

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <DismissKeyboardView style={styles.form}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../../assets/images/icon.png')}
        />
      </View>
      <View>
        <Text style={styles.title}>MacroTracker</Text>
        <Text style={styles.description}>Track your progress, witness your gains, and become a better you.</Text>
      </View>
      <Spacer />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BasicInfo')}
      >
        <Text>Get Started</Text>
      </TouchableOpacity>
    </DismissKeyboardView>
  );
};
{
  /* <Button onPress={() => navigation.navigate('MoreInfo')} title="Go to More Info" /> */
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    marginTop: 64,
    margin: 40,
    paddingLeft: 10,
    paddingTop: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 48,
    marginTop: 72,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#7078df',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
    marginHorizontal: 10,
    marginRight: 20,
    marginBottom: 20,
  },
});

export default WelcomeScreen;
