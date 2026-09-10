import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { COMPANY, COMPANY_MAPS_URL } from '../../constants';
import { palette } from '../../theme/palette';

type ContactTone = 'dark' | 'light';

interface CompanyContactDetailsProps {
  tone?: ContactTone;
}

function ContactRow({
  icon,
  children,
  tone,
}: {
  icon: ReactNode;
  children: ReactNode;
  tone: ContactTone;
}) {
  const isDark = tone === 'dark';

  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: 'flex-start',
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        bgcolor: isDark ? 'rgba(184, 149, 107, 0.14)' : 'rgba(184, 149, 107, 0.1)',
        border: '1px solid',
        borderColor: isDark ? 'rgba(212, 188, 138, 0.35)' : 'rgba(184, 149, 107, 0.28)',
      }}
    >
      <Box
        sx={{
          mt: 0.15,
          color: palette.accent.light,
          display: 'inline-flex',
          '& .MuiSvgIcon-root': { fontSize: 20 },
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="body2"
        component="div"
        sx={{
          color: isDark ? '#F4E6C8' : palette.primary.main,
          fontWeight: 600,
          lineHeight: 1.55,
          wordBreak: 'break-word',
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

export function CompanyContactDetails({ tone = 'dark' }: CompanyContactDetailsProps) {
  const linkSx = {
    color: 'inherit',
    fontWeight: 700,
    textDecorationColor: palette.accent.light,
    '&:hover': { color: palette.accent.light },
  } as const;

  return (
    <Stack spacing={1} sx={{ mt: 2.5 }}>
      <ContactRow tone={tone} icon={<EmailOutlinedIcon />}>
        <Link href={`mailto:${COMPANY.email}`} underline="hover" sx={linkSx}>
          {COMPANY.email}
        </Link>
      </ContactRow>
      <ContactRow tone={tone} icon={<PhoneOutlinedIcon />}>
        <Link href={`tel:${COMPANY.phone}`} underline="hover" sx={linkSx}>
          {COMPANY.phone}
        </Link>
      </ContactRow>
      <ContactRow tone={tone} icon={<LocationOnOutlinedIcon />}>
        <Link
          href={COMPANY_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          aria-label="Open company location in Google Maps"
          sx={linkSx}
        >
          {COMPANY.address}
        </Link>
      </ContactRow>
    </Stack>
  );
}
