import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['macromaker://'],
  config: {
    screens: {
      Root: {
        screens: {
          Diet: {
            screens: {
              DietHistoryScreen: 'history',
              DietTodayScreen: 'today',
            },
          },
          Fitness: {
            screens: {
              FitnessScreen: 'fitness',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};

export default linking;
