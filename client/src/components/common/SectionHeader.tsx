import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = 'left',
  action,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <Stack
      direction={{ xs: 'column', sm: action ? 'row' : 'column' }}
      spacing={action ? 2 : 0}
      sx={{
        mb: subtitle || eyebrow ? 2.5 : 2,
        alignItems: centered ? 'center' : action ? 'flex-end' : 'stretch',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ textAlign: align, width: action ? 'auto' : '100%' }}>
        {eyebrow ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.25,
              alignItems: 'center',
              justifyContent: centered ? 'center' : 'flex-start',
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 28,
                height: 2,
                borderRadius: 1,
                bgcolor: 'accent.main',
              }}
            />
            <Typography variant="overline" color="accent.dark">
              {eyebrow}
            </Typography>
          </Stack>
        ) : null}
        <Typography
          component="h2"
          variant="h3"
          align={align}
          sx={{ color: 'text.primary', maxWidth: centered ? 720 : 640 }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            variant="body1"
            align={align}
            color="text.secondary"
            sx={{
              mt: 1.25,
              maxWidth: centered ? 640 : 560,
              mx: centered ? 'auto' : 0,
              lineHeight: 1.75,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Stack>
  );
}
