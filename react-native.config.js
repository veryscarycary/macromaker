module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null, // Prevents vector-icons from overwriting Info.plist UIAppFonts
      },
    },
  },
};
