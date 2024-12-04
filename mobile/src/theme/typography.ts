import { TextStyle } from 'react-native';

type TypographyStyles = {
  h1: TextStyle;
  h2: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  caption: TextStyle;
};

export const typography: TypographyStyles = {
  h1: {
    fontSize: 24,
    fontWeight: '700',
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
};