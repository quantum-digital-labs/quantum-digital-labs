import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }

  interface TypeBackground {
    elevated?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    background: {
      default: palette.background.default,
      paper: palette.background.paper,
      elevated: palette.background.elevated,
    },
    text: palette.text,
    divider: palette.divider,
  },
  typography,
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 2px rgba(7, 24, 40, 0.04)',
    '0 2px 8px rgba(7, 24, 40, 0.05)',
    '0 4px 16px rgba(7, 24, 40, 0.06)',
    '0 8px 24px rgba(7, 24, 40, 0.08)',
    '0 12px 32px rgba(7, 24, 40, 0.1)',
    '0 16px 40px rgba(7, 24, 40, 0.12)',
    '0 20px 48px rgba(7, 24, 40, 0.14)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 1px 2px rgba(7, 24, 40, 0.04)',
    '0 2px 8px rgba(7, 24, 40, 0.05)',
    '0 4px 16px rgba(7, 24, 40, 0.06)',
    '0 8px 24px rgba(7, 24, 40, 0.08)',
    '0 12px 32px rgba(7, 24, 40, 0.1)',
    '0 16px 40px rgba(7, 24, 40, 0.12)',
    '0 20px 48px rgba(7, 24, 40, 0.14)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
    '0 24px 56px rgba(7, 24, 40, 0.16)',
  ],
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 22,
          paddingBlock: 10,
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(12, 35, 64, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 22px rgba(12, 35, 64, 0.24)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'box-shadow 0.2s ease',
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px rgba(184, 149, 107, 0.18)`,
          },
        },
        notchedOutline: {
          borderColor: palette.divider,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          color: palette.text.primary,
        },
        '#root': {
          minHeight: '100vh',
        },
        '::selection': {
          backgroundColor: 'rgba(184, 149, 107, 0.28)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: 'xs',
        fullWidth: true,
      },
      styleOverrides: {
        paper: {
          maxWidth: 360,
          margin: 16,
          borderRadius: 12,
          border: '1px solid rgba(12, 35, 64, 0.08)',
          boxShadow: '0 18px 48px rgba(7, 24, 40, 0.22)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
          fontSize: '0.9375rem',
          fontWeight: 700,
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          padding: '14px 16px 6px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '4px 16px 8px',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          color: palette.text.secondary,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '6px 14px 12px',
          gap: 6,
          '& .MuiButton-root': {
            minHeight: 32,
            paddingInline: 14,
            paddingBlock: 4,
            fontSize: '0.8125rem',
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export { palette, typography };
