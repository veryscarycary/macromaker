import { getTodaysDate, getDay, convertCarbsToCalories, convertProteinToCalories, convertFatToCalories, getAllStoredData, removeStoredData, storeData } from './../utils';
import { CALORIES_PER_MACRO_UNIT_MAPPING } from './../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('utils', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe('getTodaysDate', () => {
    it("should get today's date in MM/DD/YYYY string format", () => {
      const today = new Date().toLocaleDateString('en-us');
      const maxLength = 'MM/DD/YYYY'.length;

      const actual = getTodaysDate();

      expect(actual).toEqual(today);
      expect(actual.length <= maxLength).toBe(true);
    });
  });

  describe('getDay', () => {
    it("should get today's day of the week", () => {
      const date = '10/31/2000';

      const actual = getDay(date);

      expect(actual).toEqual('Tuesday');
    });

    it('should parse single-digit month/day stored dates reliably', () => {
      const date = '3/12/2026';

      const actual = getDay(date);

      expect(actual).toEqual('Thursday');
    });
  });

  describe('convertCarbsToCalories', () => {
    it("should be able to handle grams", () => {
      const grams = 10;
      const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

      const actual = convertCarbsToCalories(grams, 'g');

      expect(actual).toEqual(grams * caloriesPerCarbGram);
    });

    it("should be able to handle oz", () => {
      const oz = 2;
      const caloriesPerCarbOz = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.oz;

      const actual = convertCarbsToCalories(oz, 'oz');

      expect(actual).toEqual(oz * caloriesPerCarbOz);
    });

    it("should default to grams if no unit is provided", () => {
      const grams = 10;
      const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

      const actual = convertCarbsToCalories(grams);

      expect(actual).toEqual(grams * caloriesPerCarbGram);
    });
  });

  describe('convertProteinToCalories', () => {
    it("should be able to handle grams", () => {
      const grams = 10;
      const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.protein.g;

      const actual = convertProteinToCalories(grams, 'g');

      expect(actual).toEqual(grams * caloriesPerCarbGram);
    });

    it("should be able to handle oz", () => {
      const oz = 2;
      const caloriesPerCarbOz = CALORIES_PER_MACRO_UNIT_MAPPING.protein.oz;

      const actual = convertProteinToCalories(oz, 'oz');

      expect(actual).toEqual(oz * caloriesPerCarbOz);
    });

    it("should default to grams if no unit is provided", () => {
      const grams = 10;
      const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.protein.g;

      const actual = convertProteinToCalories(grams);

      expect(actual).toEqual(grams * caloriesPerCarbGram);
    });
  });

  describe('convertCarbsToCalories', () => {
    it("should be able to handle grams", () => {
      const grams = 10;
      const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.fat.g;

      const actual = convertFatToCalories(grams, 'g');

      expect(actual).toEqual(grams * caloriesPerCarbGram);
    });

    it("should be able to handle oz", () => {
      const oz = 2;
      const caloriesPerCarbOz = CALORIES_PER_MACRO_UNIT_MAPPING.fat.oz;

      const actual = convertFatToCalories(oz, 'oz');

      expect(actual).toEqual(oz * caloriesPerCarbOz);
    });

    it("should default to grams if no unit is provided", () => {
      const grams = 10;
      const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.fat.g;

      const actual = convertFatToCalories(grams);

      expect(actual).toEqual(grams * caloriesPerCarbGram);
    });
  });

  describe('removeStoredData', () => {
    it('should call AsyncStorage.removeItem with the correct key', async () => {
      const key = 'meals@01/01/2025';
      const spy = jest.spyOn(AsyncStorage, 'removeItem');
      await removeStoredData(key);
      expect(spy).toHaveBeenCalledWith(key);
      spy.mockRestore();
    });

    it('should complete without throwing on successful remove', async () => {
      await expect(removeStoredData('meals@01/01/2025')).resolves.not.toThrow();
    });
  });

  describe('getAllStoredData', () => {
    it('should read all stored entries through AsyncStorage.getMany', async () => {
      await storeData('meals@01/01/2025', [{ mealName: 'Breakfast', calories: 100 }]);
      await storeData('basicInfo', { tdee: 2000 });

      const data = await getAllStoredData();

      expect(AsyncStorage.getMany).toHaveBeenCalled();
      expect(data).toEqual(
        expect.arrayContaining([
          ['meals@01/01/2025', [{ mealName: 'Breakfast', calories: 100 }]],
          ['basicInfo', { tdee: 2000 }],
        ])
      );
    });
  });
});
