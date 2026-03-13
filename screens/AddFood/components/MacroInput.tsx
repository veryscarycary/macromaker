import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';

type Props = {
  type: string;
  value: string | number;
  unit: string;
  setValue: (value: string) => void;
  setUnit: (unitValue: string) => void;
};

const MacroInput = ({ type, value, unit, setValue, setUnit }: Props) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.input}>
          <TextInput
            mode="flat"
            placeholder={type}
            onChangeText={setValue}
            value={value === undefined ? undefined : value.toString()}
            keyboardType="numeric"
          />
        </View>

        {/* <View style={{ width: 50, height: 50, backgroundColor: 'red' }}></View> */}

        <View style={styles.unitSelector}>
          {['g', 'oz'].map((unitOption) => (
            <TouchableOpacity
              key={unitOption}
              style={[
                styles.unitButton,
                unit === unitOption ? styles.unitButtonSelected : null,
              ]}
              onPress={() => setUnit(unitOption)}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  unit === unitOption ? styles.unitButtonTextSelected : null,
                ]}
              >
                {unitOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingHorizontal: 0,
    margin: 0,
  },
  inputContainer: {
    margin: 0,
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 8,
  },
  unitButton: {
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7c7c7',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  unitButtonSelected: {
    backgroundColor: '#7078df',
    borderColor: '#7078df',
  },
  unitButtonText: {
    color: '#1e1e1e',
    fontSize: 13,
  },
  unitButtonTextSelected: {
    color: '#ffffff',
  },
});

export default MacroInput;
