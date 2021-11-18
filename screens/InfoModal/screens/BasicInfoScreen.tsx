import React, { useState, useContext } from 'react';
import { Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '../../../components/Themed';
import { ModalStackParamList, Navigation } from '../../../types';
import { createStackNavigator } from '@react-navigation/stack';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import { Input } from 'react-native-elements';
import Spacer from '../../../components/Spacer';
import { Context as InfoContext } from '../../../context/InfoContext';

type Props = {
  navigation: Navigation;
};

const BasicInfoScreen = ({ navigation }: Props) => {
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
    setBMR,
  } = useContext(InfoContext);

  return (
    <DismissKeyboardView style={styles.form}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../../assets/images/yoga-girl.png')}
        />
      </View>
      {/* <View style={styles.fields}> */}

      <View>
        <Input
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputContainer}
          onChangeText={(name: string) => setInfoState({ name })}
          value={name}
          placeholder="Your Name"
        />

        <Input
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputContainer}
          onChangeText={(age: string) => setInfoState({ age: Number(age) })}
          value={age}
          placeholder="Your Age"
          keyboardType="numeric"
        />

        <Input
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputContainer}
          onChangeText={(weight: string) =>
            setInfoState({ weight: Number(weight) })
          }
          value={weight}
          placeholder="Your Weight"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Height</Text>

        <View style={styles.heightPickerContainer}>
          <Picker
            style={styles.heightPicker}
            itemStyle={styles.heightPickerItem}
            selectedValue={heightFeet}
            onValueChange={(heightFeet: number) => setInfoState({ heightFeet })}
          >
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
            <Picker.Item label="6" value={6} />
            <Picker.Item label="7" value={7} />
          </Picker>

          <Picker
            style={styles.heightPicker}
            itemStyle={styles.heightPickerItem}
            selectedValue={heightInches}
            onValueChange={(heightInches: string) =>
              setInfoState({ heightInches: Number(heightInches) })
            }
          >
            <Picker.Item label="1" value={1} />
            <Picker.Item label="2" value={2} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
            <Picker.Item label="6" value={6} />
            <Picker.Item label="7" value={7} />
            <Picker.Item label="8" value={8} />
            <Picker.Item label="9" value={9} />
            <Picker.Item label="10" value={10} />
            <Picker.Item label="11" value={11} />
          </Picker>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Gender</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={gender}
          onValueChange={(gender) => setInfoState({ gender })}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Activity Level</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={activityLevel}
          onValueChange={(activityLevel) => setInfoState({ activityLevel })}
        >
          <Picker.Item label="Active" value="active" />
          <Picker.Item label="Moderate" value="moderate" />
          <Picker.Item label="Sedentary" value="sendentary" />
        </Picker>
      </View>

      {/* </View> */}
      <Spacer />
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          setBMR();
          navigation.navigate('MoreInfo')
        }}
      >
        <Text>Calculate BMI</Text>
      </TouchableOpacity>
    </DismissKeyboardView>
  );
};
{
  /* <Button onPress={() => navigation.navigate('MoreInfo')} title="Go to More Info" /> */
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7078df',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
    marginHorizontal: 10,
    marginRight: 20,
    marginBottom: 20,
  },
  form: {
    flex: 1,
    marginTop: 64,
    margin: 40,
    paddingLeft: 10,
    paddingTop: 5,
  },
  input: {
    width: 'auto',
    paddingHorizontal: 0,
    margin: 0,
  },
  inputContainer: {
    margin: 0,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 72,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heightPickerContainer: { flexDirection: 'row', maxWidth: '50%' },
  heightPicker: {
    flex: 1,
    width: 30,
    height: 40,
  },
  heightPickerItem: {
    height: 40,
  },
  picker: {
    flex: 1,
    minWidth: '50%',
    width: '50%',
    height: 40,
  },
  pickerItem: {
    height: 40,
  },
  pickerLabel: {
    flex: 1,
    minWidth: '50%',
  },
});

export default BasicInfoScreen;
