import { LinkingOptions } from '@react-navigation/native';

export default {
  prefixes: ['macromaker://'],
  config: {
    screens: {
      Root: {
        screens: {
          DietTab: {
            screens: {
              DietHistoryScreen: 'one',
            },
          },
          FitnessTab: {
            screens: {
              FitnessScreen: 'two',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
