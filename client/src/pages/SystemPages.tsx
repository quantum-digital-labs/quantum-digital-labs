import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import {
  AppBreadcrumbs,
  PageContainer,
  RouterButton,
} from '../components';
import { ROUTES } from '../constants';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Typography
        component="p"
        variant="h1"
        sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 700, color: 'primary.main' }}
      >
        404
      </Typography>
      <Typography component="h1" variant="h3">
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
        Looks like this quantum path doesn't exist. Use Back or return Home to continue.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <RouterButton to={ROUTES.home} variant="contained">
          Back to Home
        </RouterButton>
        <RouterButton to={ROUTES.services} variant="text">
          Explore Services
        </RouterButton>
      </Stack>
    </PageContainer>
  );
}

export function PrivacyPage() {
  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Privacy Policy' },
        ]}
      />
      <Typography component="h1" variant="h2">
        Privacy Policy
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This placeholder privacy policy will be replaced with the official legal text
        provided by Quantum Digital Labs Pvt. Ltd.
      </Typography>
      <RouterButton to={ROUTES.home} variant="contained">
        Back to Home
      </RouterButton>
    </PageContainer>
  );
}

export function TermsPage() {
  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Terms & Conditions' },
        ]}
      />
      <Typography component="h1" variant="h2">
        Terms & Conditions
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This placeholder terms page will be replaced with the official legal text provided
        by Quantum Digital Labs Pvt. Ltd.
      </Typography>
      <RouterButton to={ROUTES.home} variant="contained">
        Back to Home
      </RouterButton>
    </PageContainer>
  );
}
