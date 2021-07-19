import * as React from 'react';
// import { StyleSheet } from 'react-native';
import DietHistoryList from '../components/DietHistoryList';
import MacroGraph from '../components/MacroGraph';

const DietScreen = () => {
  return (
    <>
      <MacroGraph />
      <DietHistoryList />
    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginBottom: 200,
//   },
//   title: {
//     fontSize: 32,
//     fontFamily: 'helvetica',
//     fontWeight: 'bold',
//   },
//   marginTop: {
//     marginTop: 15,
//   },
// });

export default DietScreen;
