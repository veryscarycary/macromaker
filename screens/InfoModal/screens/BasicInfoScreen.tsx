import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/Themed';
import { ModalStackNavigationProp } from '../../../types';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import { Context as InfoContext } from '../../../context/InfoContext';

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
        style={[
          styles.optionButtonText,
          selectedValue === value ? styles.optionButtonTextSelected : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
              <View style={styles.input}>
                <Text style={styles.pickerLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(val: string) => setInfoState({ name: val })}
                  value={name}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.pickerLabel}>Age</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(val: string) =>
                    setInfoState({ age: val === '' ? 0 : Number(val) })
                  }
                  value={getRequiredNumberValue(age)}
                  placeholder="Enter your age"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.pickerLabel}>Weight</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(val: string) =>
                    setInfoState({ weight: val === '' ? 0 : Number(val) })
                  }
                  value={getRequiredNumberValue(weight)}
                  placeholder="Enter your weight"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={[styles.inputSection, styles.pickerSection]}>
              <Text style={styles.pickerLabel}>Height</Text>

              <View style={styles.heightSelector}>
                <View style={styles.optionGroup}>
                  <Text style={styles.optionGroupLabel}>Feet</Text>
                  <View style={styles.optionRow}>
                    {HEIGHT_FEET_OPTIONS.map((value) =>
                      renderOptionButton(`${value}`, value, heightFeet, (nextValue) =>
                        setInfoState({ heightFeet: nextValue })
                      )
                    )}
                  </View>
                </View>
                <View style={styles.optionGroup}>
                  <Text style={styles.optionGroupLabel}>Inches</Text>
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
              <Text style={styles.pickerLabel}>Gender</Text>
              <View style={styles.optionSelector}>
                {GENDER_OPTIONS.map(({ label, value }) =>
                  renderOptionButton(label, value, gender, (nextValue) =>
                    setInfoState({ gender: nextValue })
                  )
                )}
              </View>
            </View>

            <View style={[styles.inputSection, styles.pickerSection]}>
              <Text style={styles.pickerLabel}>Activity Level</Text>
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
            disabled={!isBasicInfoComplete}
            onPress={async () => {
              setBasicInfoCalculations();
              navigation.navigate('MoreInfo')
            }}
          >
            <Text style={!isBasicInfoComplete ? styles.buttonTextDisabled : styles.buttonText}>
              Calculate BMI
            </Text>
          </TouchableOpacity>
        </View>
      </DismissKeyboardView>
    </SafeAreaView>
  );
};
{
  /* <Button onPress={() => navigation.navigate('MoreInfo')} title="Go to More Info" /> */
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  button: {
    backgroundColor: '#7078df',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: '#c6c6c6',
  },
  buttonText: {
    color: '#ffffff',
  },
  buttonTextDisabled: {
    color: '#7d7d7d',
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
  content: {
    flex: 1,
  },
  input: {
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
    fontSize: 12,
    color: '#1e1e1e',
    marginTop: 4,
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
    marginBottom: 24,
  },
  pickerSection: {
    alignItems: 'flex-start',
  },
  heightSelector: {
    width: '100%',
  },
  optionGroup: {
    marginTop: 4,
  },
  optionGroupLabel: {
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.7,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerLabel: {
    fontWeight: '600',
    fontSize: 13,
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
    borderColor: '#c7c7c7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
  },
  optionButtonSelected: {
    backgroundColor: '#7078df',
    borderColor: '#7078df',
  },
  optionButtonText: {
    color: '#1e1e1e',
    fontSize: 12,
  },
  optionButtonTextSelected: {
    color: '#ffffff',
  },
  footer: {
    paddingTop: 6,
    paddingBottom: 12,
  },
});

export default BasicInfoScreen;
