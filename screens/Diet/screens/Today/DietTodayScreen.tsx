import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { defaultValues as defaultBasicInfo } from '../../../../context/InfoContext';
import { getMealData } from '../../../../context/MealContext';
import { DietDay, Info, Navigation, Meal } from '../../../../types';
import { convertCarbsToCalories, convertFatToCalories, convertProteinToCalories, getMacrosFromMeals, getStoredData, getTodaysDate } from '../../../../utils';
import BarGraph from '../../../../components/BarGraph';
import { BarGraphData } from '../../../../components/BarGraph/types';
import TotalCaloriesGraph from '../../../../components/TotalCaloriesGraph';

type Props = {
  navigation: Navigation;
};

const DietTodayScreen = ({ navigation }: Props) => {
  const [basicInfo, setBasicInfo] = useState<Info>(defaultBasicInfo);
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const {
    tdee,
    targetProteinPercentage,
    targetCarbsPercentage,
    targetFatPercentage,
  } = basicInfo;

  const targetProteinCalories = targetProteinPercentage * tdee;
  const targetCarbsCalories = targetCarbsPercentage * tdee;
  const targetFatCalories = targetFatPercentage * tdee;

  const { totalCarbs, totalProtein, totalFat } =
    getMacrosFromMeals(todaysMeals);
  
  useEffect(
    () =>
      navigation.addListener('focus', async () => {
        const basicInfo = (await getStoredData('basicInfo')) as Info;
        const dietDay = await getMealData(getTodaysDate()) as DietDay;
        if (basicInfo) setBasicInfo(basicInfo);
        if (dietDay) setTodaysMeals(dietDay.meals);
      }),
    []
  );

  const data: BarGraphData[] = [
    {
      label: 'Carbs',
      amount: convertCarbsToCalories(9999),
      targetAmount: targetCarbsCalories,
      color: '#1854bd',
    },
    {
      label: 'Protein',
      amount: convertProteinToCalories(totalProtein),
      targetAmount: targetProteinCalories,
      color: '#982f2f',
    },
    {
      label: 'Fat',
      amount: convertFatToCalories(totalFat),
      targetAmount: targetFatCalories,
      color: '#b59b46',
    },
  ];

  return (
    <>
      <BarGraph data={data} />
      <TotalCaloriesGraph data={data} />
    </>
  );
};

const styles = StyleSheet.create({});

export default DietTodayScreen;
