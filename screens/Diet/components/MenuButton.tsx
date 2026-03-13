import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MenuButton = () => {
  const navigation = useNavigation();
  const rootNavigation = navigation.getParent();

  const toggleMenu = () => {
    const rootState = rootNavigation?.getState();
    const currentRootRoute = rootState?.routes[rootState.index ?? 0];

    if (currentRootRoute?.name === 'MenuModal') {
      rootNavigation?.goBack();
      return;
    }

    rootNavigation?.navigate('MenuModal' as never);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleMenu}
    >
      <Ionicons size={30} style={{ marginBottom: -3 }} name="reorder-three" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default MenuButton;
