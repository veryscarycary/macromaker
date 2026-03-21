import React from 'react';
import { ModalStackParamList, Navigation } from '../../types';
import { createStackNavigator } from '@react-navigation/stack';
import BasicInfoScreen from './screens/BasicInfoScreen';
import MoreInfoScreen from './screens/MoreInfoScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Provider as InfoProvider } from '../../context/InfoContext';

type Props = {
  navigation: Navigation;
};

const ModalStack = createStackNavigator<ModalStackParamList>();

const ModalScreen = ({ navigation }: Props) => {
  return (
    <InfoProvider>
      <ModalStack.Navigator screenOptions={{ headerShown: false }}>
        <ModalStack.Screen name="Welcome" component={WelcomeScreen} />
        <ModalStack.Screen name="BasicInfo" component={BasicInfoScreen} />
        <ModalStack.Screen name="MoreInfo" component={MoreInfoScreen} />
      </ModalStack.Navigator>
    </InfoProvider>
  );
};

export default ModalScreen;
