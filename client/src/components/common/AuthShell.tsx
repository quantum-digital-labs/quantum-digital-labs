import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { siteImages } from '../../assets/images';
import { BrandLogo } from './BrandLogo';
import { authBackdrop } from '../../theme/surfaces';

interface AuthShellProps {
  title: string;
  tagline?: string;
  description: string;
  children: ReactNode;
  /** Short benefit lines shown under the story panel. */
  highlights?: readonly string[];
  /** Optional badge above the title. */
  badge?: string;
}

export function AuthShell({
  title,
  tagline,
  description,
  children,
  highlights,
  badge,
}: AuthShellProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 80px)' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
        overflow: 'clip',
        ...authBackdrop,
      }}
    >
      {/* Atmosphere layers */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage: `url(${siteImages.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none',
          filter: 'saturate(0.85)',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(115deg, rgba(7,24,40,0.94) 0%, rgba(7,24,40,0.78) 48%, rgba(7,24,40,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 320,
          height: 320,
          top: -80,
          left: -60,
          borderRadius: '45% 55% 60% 40% / 50% 40% 60% 50%',
          background: 'radial-gradient(circle, rgba(184,149,107,0.22), transparent 70%)',
          animation: 'qdl-auth-float 10s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 240,
          height: 240,
          bottom: -40,
          right: { xs: -80, md: '38%' },
          borderRadius: '50%',
          border: '1px dashed rgba(184,149,107,0.35)',
          animation: 'qdl-orbit-spin 28s linear infinite',
          pointerEvents: 'none',
        }}
      />

      <Stack
        spacing={3.5}
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 4, md: 7 },
          justifyContent: 'center',
          color: 'common.white',
        }}
      >
        <BrandLogo size="xl" sx={{ alignSelf: 'flex-start' }} />

        <Stack spacing={1.75} sx={{ maxWidth: 540 }}>
          {badge ? (
            <Box
              sx={{
                alignSelf: 'flex-start',
                px: 1.5,
                py: 0.6,
                borderRadius: 999,
                border: '1px solid rgba(184,149,107,0.4)',
                bgcolor: 'rgba(184,149,107,0.12)',
                color: 'accent.light',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.08em' }}>
                {badge}
              </Typography>
            </Box>
          ) : null}

          <Typography
            component="h1"
            variant="h2"
            sx={{
              color: 'common.white',
              fontSize: { xs: '2.1rem', md: '2.85rem' },
              lineHeight: 1.15,
            }}
          >
            {title}
          </Typography>

          {tagline ? (
            <Typography variant="overline" sx={{ color: 'accent.light', letterSpacing: '0.14em' }}>
              {tagline}
            </Typography>
          ) : null}

          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 460, lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            {description}
          </Typography>
        </Stack>

        {highlights && highlights.length > 0 ? (
          <Stack spacing={1.25} sx={{ maxWidth: 420 }}>
            {highlights.map((item) => (
              <Stack key={item} direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'accent.main',
                    boxShadow: '0 0 0 4px rgba(184,149,107,0.18)',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)' }}>
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : null}

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            mt: 1,
            maxWidth: 420,
            height: 180,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(184,149,107,0.28)',
            boxShadow: '0 20px 48px rgba(0,0,0,0.35)',
          }}
        >
          <Box
            component="img"
            src={siteImages.team}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(7,24,40,0.75) 100%)',
            }}
          />
        </Box>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, md: 5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
