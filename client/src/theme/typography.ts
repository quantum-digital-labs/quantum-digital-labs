import type { ThemeOptions } from '@mui/material/styles';

const displayFamily = '"Fraunces", "Georgia", "Times New Roman", serif';
const uiFamily = '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif';

/**
 * Editorial display headings + clean UI sans for body and controls.
 */
export const typography: NonNullable<ThemeOptions['typography']> = {
  fontFamily: uiFamily,
  h1: {
    fontFamily: displayFamily,
    fontWeight: 600,
    fontSize: '3rem',
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontFamily: displayFamily,
    fontWeight: 600,
    fontSize: '2.375rem',
    lineHeight: 1.18,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontFamily: displayFamily,
    fontWeight: 600,
    fontSize: '1.875rem',
    lineHeight: 1.25,
    letterSpacing: '-0.015em',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.3125rem',
    lineHeight: 1.35,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.45,
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.55,
  },
  subtitle2: {
    fontWeight: 600,
    fontSize: '0.8125rem',
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.65,
  },
  button: {
    fontWeight: 600,
    fontSize: '0.9375rem',
    textTransform: 'none',
    letterSpacing: '0.01em',
  },
  caption: {
    fontWeight: 500,
    fontSize: '0.75rem',
    lineHeight: 1.45,
    letterSpacing: '0.02em',
  },
  overline: {
    fontWeight: 700,
    fontSize: '0.6875rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
};
