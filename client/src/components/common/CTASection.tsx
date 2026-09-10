import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RouterButton } from './RouterButton';

interface CTASectionProps {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: CTASectionProps) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mt: { xs: 2, md: 3 },
        p: { xs: 3.5, md: 5 },
        borderRadius: 3,
        bgcolor: 'primary.dark',
        color: 'common.white',
        border: '1px solid rgba(184, 149, 107, 0.22)',
        boxShadow: '0 20px 48px rgba(7, 24, 40, 0.22)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 80% at 100% 0%, rgba(184, 149, 107, 0.16) 0%, transparent 55%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 3, md: 4 }}
        sx={{
          position: 'relative',
          zIndex: 1,
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ maxWidth: 620 }}>
          <Typography
            component="p"
            variant="overline"
            sx={{ color: 'accent.light', mb: 1.25, display: 'block' }}
          >
            Work with us
          </Typography>
          <Typography component="h2" variant="h3" sx={{ color: 'common.white', mb: description ? 1.5 : 0 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body1" sx={{ opacity: 0.82, lineHeight: 1.75 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flexShrink: 0 }}>
          <RouterButton
            to={primaryTo}
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              bgcolor: 'accent.main',
              color: 'accent.contrastText',
              fontWeight: 700,
              px: 3,
              '&:hover': { bgcolor: 'accent.light' },
            }}
          >
            {primaryLabel}
          </RouterButton>
          {secondaryLabel && secondaryTo ? (
            <RouterButton
              to={secondaryTo}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.35)',
                color: 'common.white',
                '&:hover': {
                  borderColor: 'accent.light',
                  bgcolor: 'rgba(255,255,255,0.06)',
                },
              }}
            >
              {secondaryLabel}
            </RouterButton>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}
