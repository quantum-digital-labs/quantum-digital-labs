import type { SxProps, Theme } from '@mui/material/styles';
import { palette } from './palette';

/** Shared elevation and border treatment for premium cards. */
export const cardSurface: SxProps<Theme> = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2.5,
  boxShadow: '0 1px 2px rgba(12, 35, 64, 0.04), 0 8px 24px rgba(12, 35, 64, 0.04)',
  transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.28s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 32px rgba(12, 35, 64, 0.1)',
    borderColor: 'rgba(184, 149, 107, 0.45)',
  },
};

/** Light section panel on the default page background. */
export const sectionPanel: SxProps<Theme> = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 3,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 1px 2px rgba(12, 35, 64, 0.03), 0 16px 40px rgba(12, 35, 64, 0.04)',
};

/** Dark auth / marketing backdrop. */
export const authBackdrop = {
  background: `
    radial-gradient(ellipse 70% 55% at 8% 12%, rgba(46, 90, 140, 0.28) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 92% 88%, rgba(184, 149, 107, 0.14) 0%, transparent 50%),
    linear-gradient(155deg, ${palette.background.dark} 0%, #0A1E35 52%, #071828 100%)
  `,
} as const;

export const authPanel: SxProps<Theme> = {
  width: '100%',
  maxWidth: 440,
  p: { xs: 2.75, sm: 3.5 },
  borderRadius: 3,
  border: '1px solid rgba(184, 149, 107, 0.22)',
  bgcolor: 'rgba(7, 24, 40, 0.82)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255,255,255,0.06)',
};

export const primaryButtonSx: SxProps<Theme> = {
  py: 1.25,
  px: 2.75,
  fontWeight: 700,
  borderRadius: 2,
  boxShadow: '0 4px 14px rgba(12, 35, 64, 0.18)',
  '&:hover': {
    boxShadow: '0 8px 22px rgba(12, 35, 64, 0.22)',
  },
};

export const goldLinkSx: SxProps<Theme> = {
  color: palette.accent.light,
  fontWeight: 700,
  textUnderlineOffset: 3,
};
