import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/Themed';
import { ModalStackNavigationProp } from '../../../types';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import Spacer from '../../../components/Spacer';
import StepIndicator from '../components/StepIndicator';

type Props = {
  navigation: ModalStackNavigationProp;
};

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StepIndicator totalSteps={3} currentStep={1} />
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
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </DismissKeyboardView>
    </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default WelcomeScreen;
