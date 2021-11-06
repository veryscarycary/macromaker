import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Navigation } from '../types';
import ModalButton from './components/ModalButton';

const TopNotch = () => (
  <View style={styles.topNotchContainer}>
    <View style={styles.topNotch}></View>
  </View>
);

type Props = {
  navigation: Navigation;
};

const MenuModalScreen = ({ navigation }: Props) => {
  const [isBorder] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* this is where the modal actually starts */}
      <View
        style={{
          backgroundColor: '#dfdfdf',
          justifyContent: 'center',
          paddingBottom: 24,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <TopNotch />
        <ModalButton icon="time" onPress={() => navigation.navigate('DietHistoryScreen')}>History</ModalButton>
        <ModalButton icon="settings" hasBottomBorder={false}>
          Settings
        </ModalButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topNotchContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  topNotch: {
    width: '10%',
    height: 4,
    backgroundColor: '#b1b1b1',
    borderRadius: 20,
  },
});

export default MenuModalScreen;
