import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
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
  return (
    <Pressable style={styles.overlay} onPress={() => navigation.goBack()}>
      <View style={styles.topBar}>
        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()} />
      </View>

      <Pressable onPress={() => {}}>
        <View style={styles.sheet}>
          <TopNotch />
          <ModalButton
            icon="time"
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Root',
                      state: {
                        index: 0,
                        routes: [
                          {
                            name: 'Diet',
                            state: {
                              index: 1,
                              routes: [
                                { name: 'DietTodayScreen' },
                                { name: 'DietHistoryScreen' },
                              ],
                            },
                          },
                          { name: 'Fitness' },
                        ],
                      },
                    },
                  ],
                })
              );
            }}
          >
            History
          </ModalButton>
          <ModalButton icon="settings" hasBottomBorder={false} onPress={() => {}}>
            Settings
          </ModalButton>
        </View>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  closeButton: {
    width: 38,
    height: 38,
  },
  sheet: {
    backgroundColor: '#dfdfdf',
    justifyContent: 'center',
    paddingBottom: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
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
