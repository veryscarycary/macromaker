import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '../../../components/Themed';
import { Dimensions, TextInput } from 'react-native';

type Props = {
  type: string;
  value: string | number;
  unit: string;
  defaultValue: string | number;
  defaultUnit: string;
  setValue: (value: string) => void;
  setUnit: (unitValue: string) => void;
};

const MacroInput = ({ type, value, defaultValue, unit, defaultUnit, setValue, setUnit }: Props) => {

  return (
    <>
      <View style={styles.container}>
        <Input
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputContainer}
          placeholder={type}
          // leftIcon={<Icon name="user" size={24} color="black" />}
          onChangeText={setValue}
          value={value === undefined ? undefined : value.toString()}
          defaultValue={defaultValue === undefined ? undefined : defaultValue.toString()}
        />

        {/* <View style={{ width: 50, height: 50, backgroundColor: 'red' }}></View> */}

        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={unit || defaultUnit}
          onValueChange={setUnit}
        >
          <Picker.Item label="g" value="g" />
          <Picker.Item label="oz" value="oz" />
        </Picker>
      </View>
    </>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
  },
  input: {
    width: 'auto',
    flex: 1,
    paddingHorizontal: 0,
    margin: 0,
  },
  inputContainer: {
    margin: 0,
  },
  picker: {
    width: 50,
    height: 50,
  },
  pickerItem: {
    height: 50,
  }
};

export default MacroInput;
