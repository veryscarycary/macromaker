import React, { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/Themed';
import StepIndicator from '../components/StepIndicator';
import { ModalStackNavigationProp } from '../../../types';
import { Context as InfoContext } from '../../../context/InfoContext';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import PercentageSlider from '../../../components/PercentageSlider';
import { getInfoWithCalculatedMetrics, storeBasicInfo } from '../../../context/InfoContext';
import { colors } from '../../../design/tokens/colors';
import { fontFamilies } from '../../../design/tokens/typography';

type Props = {
  navigation: ModalStackNavigationProp;
};

const MoreInfoScreen = ({ navigation }: Props) => {
  const { height } = useWindowDimensions();
  const isCompact = height < 760;
  const {
    state: {
      targetProteinPercentage,
      targetCarbsPercentage,
      targetFatPercentage,
    },
    state,
    setInfoState,
  } = useContext(InfoContext);
  const [macroError, setMacroError] = useState(false);
  const infoWithCalculatedMetrics = getInfoWithCalculatedMetrics(state);
  const {
    bmr: calculatedBmr,
    bmi: calculatedBmi,
    tdee: calculatedTdee,
  } = infoWithCalculatedMetrics;

  const macroSum = Math.round((targetProteinPercentage + targetCarbsPercentage + targetFatPercentage) * 100);

  const handleSliderChange = (setter: (v: number) => void) => (value: number) => {
    setMacroError(false);
    setter(value);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StepIndicator totalSteps={3} currentStep={3} />
      <DismissKeyboardView style={styles.form}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.imageContainer, isCompact ? styles.imageContainerCompact : null]}>
            <Image
              style={[styles.image, isCompact ? styles.imageCompact : null]}
              source={require('../../../assets/images/yoga-girl.png')}
            />
          </View>
          <View style={[styles.metricsSection, isCompact ? styles.metricsSectionCompact : null]}>
            <Text style={[styles.title, isCompact ? styles.titleCompact : null]}>BMI: {calculatedBmi.toFixed(1)}</Text>
            <Text style={[styles.title, isCompact ? styles.titleCompact : null]}>BMR: {Math.round(calculatedBmr)}</Text>
            <Text style={[styles.title, isCompact ? styles.titleCompact : null]}>TDEE: {Math.round(calculatedTdee)}</Text>
          </View>
          <View style={[styles.descriptionSection, isCompact ? styles.descriptionSectionCompact : null]}>
            <Text style={[styles.description, isCompact ? styles.descriptionCompact : null]}>
              Based on your body and activity level, you should aim for a target of{' '}
              <Text style={styles.descriptionHighlight}>{Math.round(calculatedTdee)}</Text> calories per day.
            </Text>
            <Text style={[styles.description, isCompact ? styles.descriptionCompact : null]}>
              We recommend following these macro proportions in order to reach your
              goal. If you'd like to adjust them, you can do so now.
            </Text>
          </View>
          <View style={[styles.sliderSection, isCompact ? styles.sliderSectionCompact : null, macroError ? styles.sliderSectionError : null]}>
            <PercentageSlider
              label="Protein"
              setValue={handleSliderChange((value: number) =>
                setInfoState({ targetProteinPercentage: value })
              )}
              value={targetProteinPercentage}
            />
            <PercentageSlider
              label="Carbs"
              style={styles.sliderSpacing}
              setValue={handleSliderChange((value: number) =>
                setInfoState({ targetCarbsPercentage: value })
              )}
              value={targetCarbsPercentage}
            />
            <PercentageSlider
              label="Fat"
              style={styles.sliderSpacing}
              setValue={handleSliderChange((value: number) =>
                setInfoState({ targetFatPercentage: value })
              )}
              value={targetFatPercentage}
            />
            {macroError && (
              <Text style={styles.macroErrorText}>
                Percentages must add up to 100% (currently {macroSum}%)
              </Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (macroSum !== 100) {
                setMacroError(true);
                return;
              }
              await storeBasicInfo(infoWithCalculatedMetrics);
              navigation.getParent()?.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Root' }] })
              );
            }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  image: {
    width: 88,
    height: 88,
  },
  imageCompact: {
    width: 68,
    height: 68,
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
    color: colors.text.primary,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  imageContainerCompact: {
    marginBottom: 6,
    marginTop: 0,
  },
  metricsSection: {
    marginBottom: 8,
  },
  metricsSectionCompact: {
    marginBottom: 6,
  },
  descriptionSection: {
    marginBottom: 10,
  },
  descriptionSectionCompact: {
    marginBottom: 8,
  },
  descriptionHighlight: {
    fontFamily: fontFamilies.bold,
  },
  sliderSection: {
    gap: 0,
    marginTop: 'auto',
  },
  sliderSectionCompact: {
    marginTop: 0,
  },
  sliderSpacing: {
    marginTop: 10,
  },
  sliderSectionError: {
    borderWidth: 1.5,
    borderColor: colors.status.error,
    borderRadius: 8,
    padding: 10,
  },
  macroErrorText: {
    fontFamily: fontFamilies.regular,
    color: colors.status.error,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 16,
    marginBottom: 2,
  },
  descriptionCompact: {
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 6,
  },
  footer: {
    paddingTop: 6,
    paddingBottom: 12,
  },
  button: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 6,
  },
  buttonText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.text.inverse,
  },
});

export default MoreInfoScreen;
