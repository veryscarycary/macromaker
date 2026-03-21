import React, { useContext, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../../design/components';
import { ModalStackNavigationProp } from '../../../types';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import { Context as InfoContext } from '../../../context/InfoContext';
import StepIndicator from '../components/StepIndicator';
import { colors } from '../../../design/tokens/colors';
import { fontFamilies } from '../../../design/tokens/typography';
import { spacing } from '../../../design/tokens/spacing';

type Props = {
  navigation: ModalStackNavigationProp;
};

const HEIGHT_FEET_OPTIONS = [3, 4, 5, 6, 7];
const HEIGHT_INCH_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];
const ACTIVITY_LEVEL_OPTIONS = [
  { label: 'Sedentary', value: 1 },
  { label: 'Moderate', value: 2 },
  { label: 'Very Active', value: 3 },
  { label: 'Extremely Active', value: 4 },
  { label: 'Active', value: 5 },
];

const getRequiredNumberValue = (value: number) => (value > 0 ? String(value) : '');

const BasicInfoScreen = ({ navigation }: Props) => {
  const [nameError, setNameError] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [ageFocused, setAgeFocused] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const { height } = useWindowDimensions();
  const isCompact = height < 760;
  const {
    state: {
      name,
      age,
      gender,
      heightFeet,
      heightInches,
      weight,
      activityLevel,
    },
    setInfoState,
    setBasicInfoCalculations,
  } = useContext(InfoContext);
  const isBasicInfoComplete =
    name.trim().length > 0 && age > 0 && weight > 0;

  const renderOptionButton = <T extends string | number>(
    label: string,
    value: T,
    selectedValue: T,
    onPress: (nextValue: T) => void
  ) => (
    <TouchableOpacity
      key={String(value)}
      style={[
        styles.optionButton,
        selectedValue === value ? styles.optionButtonSelected : null,
      ]}
      onPress={() => onPress(value)}
    >
      <Text
        variant="label"
        style={[
          styles.optionButtonText,
          selectedValue === value ? styles.optionButtonTextSelected : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const getInputBorderColor = (focused: boolean, hasError = false) => {
    if (hasError) return colors.status.error;
    if (focused) return colors.brand.primary;
    return colors.surface.border;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StepIndicator totalSteps={3} currentStep={2} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            <View style={styles.content}>
              <View style={styles.inputSection}>
                <View style={styles.inputWrap}>
                  <Text variant="label" style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    style={[styles.textInput, { borderBottomColor: getInputBorderColor(nameFocused, nameError) }]}
                    onChangeText={(val: string) => {
                      setInfoState({ name: val });
                      if (nameError && val.trim().length > 0) setNameError(false);
                    }}
                    value={name}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.text.tertiary}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                  {nameError && (
                    <Text variant="caption" style={styles.errorText}>Name is required</Text>
                  )}
                </View>

                <View style={styles.inputWrap}>
                  <Text variant="label" style={styles.fieldLabel}>Age</Text>
                  <TextInput
                    style={[styles.textInput, { borderBottomColor: getInputBorderColor(ageFocused) }]}
                    onChangeText={(val: string) =>
                      setInfoState({ age: val === '' ? 0 : Number(val) })
                    }
                    value={getRequiredNumberValue(age)}
                    placeholder="Enter your age"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="numeric"
                    onFocus={() => setAgeFocused(true)}
                    onBlur={() => setAgeFocused(false)}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text variant="label" style={styles.fieldLabel}>Weight</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.textInput, styles.textInputFlex, { borderBottomColor: getInputBorderColor(weightFocused) }]}
                      onChangeText={(val: string) =>
                        setInfoState({ weight: val === '' ? 0 : Number(val) })
                      }
                      value={getRequiredNumberValue(weight)}
                      placeholder="150"
                      placeholderTextColor={colors.text.tertiary}
                      keyboardType="numeric"
                      onFocus={() => setWeightFocused(true)}
                      onBlur={() => setWeightFocused(false)}
                    />
                    <View style={styles.unitPill}>
                      <Text variant="caption" style={styles.unitText}>lbs</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.inputSection, styles.pickerSection]}>
                <Text variant="label" style={styles.fieldLabel}>Height</Text>
                <View style={styles.heightSelector}>
                  <View style={styles.optionGroup}>
                    <Text variant="caption" style={styles.optionGroupLabel}>Feet</Text>
                    <View style={styles.optionRow}>
                      {HEIGHT_FEET_OPTIONS.map((value) =>
                        renderOptionButton(`${value}`, value, heightFeet, (nextValue) =>
                          setInfoState({ heightFeet: nextValue })
                        )
                      )}
                    </View>
                  </View>
                  <View style={styles.optionGroup}>
                    <Text variant="caption" style={styles.optionGroupLabel}>Inches</Text>
                    <View style={styles.optionRow}>
                      {HEIGHT_INCH_OPTIONS.map((value) =>
                        renderOptionButton(`${value}`, value, heightInches, (nextValue) =>
                          setInfoState({ heightInches: nextValue })
                        )
                      )}
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.inputSection, styles.pickerSection]}>
                <Text variant="label" style={styles.fieldLabel}>Gender</Text>
                <View style={styles.optionSelector}>
                  {GENDER_OPTIONS.map(({ label, value }) =>
                    renderOptionButton(label, value, gender, (nextValue) =>
                      setInfoState({ gender: nextValue })
                    )
                  )}
                </View>
              </View>

              <View style={[styles.inputSection, styles.pickerSection]}>
                <Text variant="label" style={styles.fieldLabel}>Activity Level</Text>
                <View style={styles.optionSelector}>
                  {ACTIVITY_LEVEL_OPTIONS.map(({ label, value }) =>
                    renderOptionButton(label, value, activityLevel, (nextValue) =>
                      setInfoState({ activityLevel: nextValue })
                    )
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, !isBasicInfoComplete ? styles.buttonDisabled : null]}
              onPress={() => {
                if (!isBasicInfoComplete) {
                  setNameError(true);
                  return;
                }
                setNameError(false);
                setBasicInfoCalculations();
                navigation.navigate('MoreInfo');
              }}
            >
              <Text
                variant="body"
                style={!isBasicInfoComplete ? styles.buttonTextDisabled : styles.buttonText}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </DismissKeyboardView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  imageContainerCompact: {
    marginBottom: 6,
  },
  image: {
    width: 150,
    height: 150,
  },
  imageCompact: {
    width: 72,
    height: 72,
  },
  inputSection: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: spacing.md,
    padding: spacing.md,
  },
  pickerSection: {
    alignItems: 'flex-start',
  },
  inputWrap: {
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  textInput: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.neutral[50],
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.neutral[200],
  },
  textInputFlex: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  unitPill: {
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  unitText: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: colors.text.secondary,
  },
  heightSelector: {
    width: '100%',
  },
  optionGroup: {
    marginTop: 4,
  },
  optionGroupLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 6,
    marginTop: 4,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.neutral[100],
  },
  optionButtonSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  optionButtonText: {
    fontFamily: fontFamilies.regular,
    color: colors.text.primary,
    fontSize: 12,
  },
  optionButtonTextSelected: {
    color: colors.text.inverse,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    color: colors.status.error,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    paddingTop: 6,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  button: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: colors.surface.border,
  },
  buttonText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.text.inverse,
  },
  buttonTextDisabled: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.text.tertiary,
  },
});

export default BasicInfoScreen;
