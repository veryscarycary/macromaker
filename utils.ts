import AsyncStorage from '@react-native-async-storage/async-storage';


export const getTodaysDate = (): string => new Date().toLocaleDateString('en-us');
export const convertCarbsToCalories = (carbs: number): number => (carbs || 0) * 4;
export const convertProteinToCalories = (protein: number): number => convertCarbsToCalories(protein);
export const convertFatToCalories = (fat: number): number => (fat || 0) * 9;

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(`Error: ${e}`);
  }
}

export const getStoredData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch(e) {
    console.error(`Error: ${e}`);
  }
}