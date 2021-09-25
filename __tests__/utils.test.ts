import { getTodaysDate, getDay, convertCarbsToCalories, convertProteinToCalories, convertFatToCalories } from './../utils';
import { CALORIES_PER_MACRO_UNIT_MAPPING } from './../constants';

describe('utils', () => {
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
    
    it("should get today's day of the week", () => {
      const date = '10/31/2000';

      const actual = getDay(date);

      expect(actual).toEqual('Tuesday');
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
});
