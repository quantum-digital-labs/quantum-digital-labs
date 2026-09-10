import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import {
  COMPANY,
  FOOTER_COMPANY,
  FOOTER_LEGAL,
  FOOTER_RESOURCES,
  FOOTER_SERVICES,
  type NavItem,
} from '../../constants';
import { palette } from '../../theme/palette';
import { BrandLogo } from '../common/BrandLogo';
import { CompanyContactDetails } from '../common/CompanyContactDetails';

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <Stack spacing={1.25}>
      <Typography
        variant="overline"
        sx={{ color: palette.accent.light, fontWeight: 700, letterSpacing: '0.12em' }}
      >
        {title}
      </Typography>
      {items.map((item) => (
        <Link
          key={item.path}
          component={RouterLink}
          to={item.path}
          underline="none"
          color="inherit"
          variant="body2"
          sx={{
            opacity: 0.78,
            transition: 'opacity 0.2s ease, color 0.2s ease',
            '&:hover': {
              opacity: 1,
              color: palette.accent.light,
            },
          }}
        >
          {item.label}
        </Link>
      ))}
    </Stack>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: palette.background.dark,
        color: 'common.white',
        pt: { xs: 5, md: 7 },
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${palette.accent.main}, ${palette.accent.light}, transparent)`,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <BrandLogo size="md" variant="dark" />
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.78, maxWidth: 340, lineHeight: 1.75 }}>
              {COMPANY.tagline}. Technology, staffing, training, internships, digital
              marketing, and project services for businesses and emerging talent.
            </Typography>
            <CompanyContactDetails tone="dark" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Company" items={FOOTER_COMPANY} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Services" items={FOOTER_SERVICES} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Resources" items={FOOTER_RESOURCES} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Legal" items={FOOTER_LEGAL} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3.5, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: { sm: 'center' },
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            © {year} {COMPANY.legalName}. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            Founded {COMPANY.founded}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
