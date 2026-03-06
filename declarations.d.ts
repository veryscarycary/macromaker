import { Component } from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface VectorIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

declare module 'react-native-vector-icons/Ionicons' {
  export default class Ionicons extends Component<VectorIconProps> {}
}

declare module 'react-native-vector-icons/Feather' {
  export default class Feather extends Component<VectorIconProps> {}
}

declare module 'react-native-vector-icons/FontAwesome' {
  export default class FontAwesome extends Component<VectorIconProps> {}
}
