import React, { useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { Text, View } from '../components/Themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Spacer from '../components/Spacer';

import { Picker } from '@react-native-picker/picker';
import MacroInput from '../components/MacroInput';

const AddFoodScreen = ({}) => {
  const [search, setSearch] = useState('');

  const [carbs, setCarbs] = useState('');
  const [carbUnit, setCarbUnit] = useState('g');
  
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');


  console.log('search', search);
  return (
    <>
      <SearchBar
        lightTheme={true}
        placeholder="Broccoli, pizza, etc"
        onChangeText={setSearch}
        value={search}
      />

      <View style={styles.addMealForm}>
        {/* <View style={styles.fields}> */}
          <MacroInput type="Carbs" />
          <MacroInput type="Protein" />
          <MacroInput type="Fat" />
          <Text style={styles.calories}>Calories:</Text>
        {/* </View> */}
        <Spacer></Spacer>
        <TouchableOpacity style={styles.addMealButton}>
          <Text style={styles.addMealText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  calories: { fontSize: 24, marginTop: 15 },
  marginTop: {marginTop: 5},
  addMealForm: {
    flex: 1,
    margin: 40,
    paddingLeft: 10,
    paddingTop: 5,
  },
  addMealButton: {
    backgroundColor: '#7078df',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12 ,
    marginHorizontal: 10,
    marginRight: 20,
    marginBottom: 20,
  },
  addMealText: {
    fontSize: 20,
  },
  fields: {
    marginBottom: 40,
  }
});

export default AddFoodScreen;
