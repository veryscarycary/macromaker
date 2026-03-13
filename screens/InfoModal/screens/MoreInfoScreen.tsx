import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/Themed';
import { ModalStackNavigationProp } from '../../../types';
import { Context as InfoContext } from '../../../context/InfoContext';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import PercentageSlider from '../../../components/PercentageSlider';
import { getInfoWithCalculatedMetrics, storeBasicInfo } from '../../../context/InfoContext';

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
  const infoWithCalculatedMetrics = getInfoWithCalculatedMetrics(state);
  const {
    bmr: calculatedBmr,
    bmi: calculatedBmi,
    tdee: calculatedTdee,
  } = infoWithCalculatedMetrics;
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
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
          <View style={[styles.sliderSection, isCompact ? styles.sliderSectionCompact : null]}>
            <PercentageSlider
              label="Protein"
              setValue={(value: number) =>
                setInfoState({ targetProteinPercentage: value })
              }
              value={targetProteinPercentage}
            />
            <PercentageSlider
              label="Carbs"
              style={styles.sliderSpacing}
              setValue={(value: number) =>
                setInfoState({ targetCarbsPercentage: value })
              }
              value={targetCarbsPercentage}
            />
            <PercentageSlider
              label="Fat"
              style={styles.sliderSpacing}
              setValue={(value: number) =>
                setInfoState({ targetFatPercentage: value })
              }
              value={targetFatPercentage}
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await storeBasicInfo(infoWithCalculatedMetrics);
              navigation.getParent()?.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Root' }] })
              );
            }}
          >
            <Text>Finish</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
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
    fontWeight: 'bold',
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
    backgroundColor: '#7078df',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 6,
  },
});

export default MoreInfoScreen;
