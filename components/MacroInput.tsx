import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from './Themed';
import { Dimensions, TextInput } from 'react-native';

type Props = {
  type: string;
};

const MacroInput = ({ type }: Props) => {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('g');

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
          value={value}
        />

        {/* <View style={{ width: 50, height: 50, backgroundColor: 'red' }}></View> */}

        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={unit}
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
