import React, { useContext } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { ModalStackParamList, Navigation } from '../../../types';
import { createStackNavigator } from '@react-navigation/stack';
import { Context as InfoContext } from '../../../context/InfoContext';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import Spacer from '../../../components/Spacer';
import PercentageSlider from '../../../components/PercentageSlider';
import { storeBasicInfo } from '../../../context/InfoContext';

type Props = {
  navigation: Navigation;
};

const ModalStack = createStackNavigator<ModalStackParamList>();

const MoreInfoScreen = ({ navigation }: Props) => {
  const {
    state: {
      bmr,
      bmi,
      tdee,
      targetProteinPercentage,
      targetCarbsPercentage,
      targetFatPercentage,
    },
    state,
    setInfoState,
  } = useContext(InfoContext);
  return (
    <DismissKeyboardView style={styles.form}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../../assets/images/yoga-girl.png')}
        />
      </View>
      <View>
        <Text style={styles.title}>BMI: {bmi.toFixed(1)}</Text>
        <Text style={styles.title}>BMR: {Math.round(bmr)}</Text>
        <Text style={styles.title}>TDEE: {Math.round(tdee)}</Text>
      </View>
      <View>
        <Text style={styles.description}>
          Based on your body and activity level, you should aim for a target of{' '}
          <Text style={{ fontWeight: 'bold' }}>{Math.round(tdee)}</Text> calories per day.
        </Text>
        <Text style={styles.description}>
          We recommend following these macro proportions in order to reach your
          goal. If you'd like to adjust them, you can do so now.
        </Text>
      </View>
      <View>
        <PercentageSlider
          label="Protein"
          setValue={(value: number) =>
            setInfoState({ targetProteinPercentage: value })
          }
          value={targetProteinPercentage}
        />
        <PercentageSlider
          label="Carbs"
          setValue={(value: number) =>
            setInfoState({ targetCarbsPercentage: value })
          }
          value={targetCarbsPercentage}
        />
        <PercentageSlider
          label="Fat"
          setValue={(value: number) =>
            setInfoState({ targetFatPercentage: value })
          }
          value={targetFatPercentage}
        />
      </View>
      <Spacer />
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await storeBasicInfo(state);
          navigation.navigate('Root');
        }}
        title="Dismiss"
      >
        <Text>Finish</Text>
      </TouchableOpacity>
    </DismissKeyboardView>
  );
};

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
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
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

export default MoreInfoScreen;
