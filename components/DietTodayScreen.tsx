import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { DietScreenNavigationProp } from '../types';
import BarGraph from './BarGraph';
import TotalCaloriesGraph from './TotalCaloriesGraph';

type Props = {
  navigation: DietScreenNavigationProp;
};

const DietTodayScreen = ({ navigation }: Props) => {
  // const [dietHistory, setDietHistory] = useState([]);

  // const { averageCalories, averageCarbs, averageProtein, averageFat } =
  //   getAveragesFromDietDays(dietHistory);

  // useEffect(
  //   () =>
  //     navigation.addListener('focus', async () => {
  //       const dietHistory = await getAllMealData();
  //       setDietHistory(dietHistory);
  //     }),
  //   []
  // );

  return (
    <>
      <View>
        <BarGraph />
        <TotalCaloriesGraph />
      </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default DietTodayScreen;
