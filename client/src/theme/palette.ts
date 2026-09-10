/**
 * Quantum Digital Labs brand palette — refined navy with warm brass accent.
 */
export const palette = {
  primary: {
    main: '#0C2340',
    light: '#1A3D66',
    dark: '#071828',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2E5A8C',
    light: '#4A7AB0',
    dark: '#1E4068',
    contrastText: '#FFFFFF',
  },
  accent: {
    main: '#B8956B',
    light: '#D4BC8A',
    dark: '#96784F',
    contrastText: '#1A1408',
  },
  background: {
    default: '#F6F5F2',
    paper: '#FFFFFF',
    dark: '#071828',
    mist: '#ECEAE6',
    elevated: '#FAFAF8',
  },
  text: {
    primary: '#141C28',
    secondary: '#5C6678',
    disabled: '#9AA3B2',
  },
  divider: '#D8DDE6',
} as const;

export const brandGold = palette.accent.main;
export const brandGoldLight = palette.accent.light;
