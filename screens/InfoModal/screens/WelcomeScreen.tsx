import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/Themed';
import { ModalStackNavigationProp } from '../../../types';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import Spacer from '../../../components/Spacer';
import StepIndicator from '../components/StepIndicator';
import { colors } from '../../../design/tokens/colors';
import { fontFamilies } from '../../../design/tokens/typography';

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 48,
    marginTop: 72,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 48,
    color: colors.text.primary,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    textAlign: 'center',
    color: colors.text.secondary,
  },
  button: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.text.inverse,
  },
});

export default WelcomeScreen;
