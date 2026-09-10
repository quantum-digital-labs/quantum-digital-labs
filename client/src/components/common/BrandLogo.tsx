import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { siteImages } from '../../assets/images';
import { COMPANY, ROUTES } from '../../constants';

type BrandLogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface BrandLogoProps {
  size?: BrandLogoSize;
  to?: string;
  sx?: object;
  /** Light variant for dark backgrounds (default). */
  variant?: 'dark' | 'light';
}

const sizeMap: Record<BrandLogoSize, { height: number; mark: number; word: number }> = {
  sm: { height: 44, mark: 44, word: 132 },
  md: { height: 56, mark: 56, word: 168 },
  lg: { height: 80, mark: 80, word: 240 },
  xl: { height: 104, mark: 104, word: 310 },
};

export function BrandLogo({ size = 'md', to = ROUTES.home, sx, variant = 'dark' }: BrandLogoProps) {
  const dims = sizeMap[size];
  const isDarkBg = variant === 'dark';

  return (
    <Box
      component={RouterLink}
      to={to}
      aria-label={`${COMPANY.shortName} home`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        textDecoration: 'none',
        flexShrink: 0,
        lineHeight: 0,
        p: 0.4,
        borderRadius: 2,
        bgcolor: isDarkBg ? 'rgba(7, 24, 40, 0.88)' : '#0B1522',
        border: '1px solid rgba(184, 149, 107, 0.28)',
        boxShadow: isDarkBg ? '0 8px 28px rgba(0, 0, 0, 0.28)' : '0 6px 18px rgba(7, 24, 40, 0.16)',
        overflow: 'hidden',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: isDarkBg ? '0 12px 32px rgba(0, 0, 0, 0.32)' : '0 10px 22px rgba(7, 24, 40, 0.2)',
        },
        ...sx,
      }}
    >
      <Box
        component="img"
        src={siteImages.logoMark}
        alt=""
        decoding="async"
        sx={{
          display: 'block',
          height: { xs: Math.round(dims.mark * 0.9), sm: dims.mark },
          width: 'auto',
          objectFit: 'contain',
        }}
      />
      <Box
        component="img"
        src={siteImages.logoWordmark}
        alt={`${COMPANY.legalName} — ${COMPANY.tagline}`}
        decoding="async"
        sx={{
          display: 'block',
          height: { xs: Math.round(dims.height * 0.9), sm: dims.height },
          width: 'auto',
          maxWidth: { xs: Math.round(dims.word * 0.88), sm: dims.word },
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
