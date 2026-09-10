import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { RouterButton } from '../common/RouterButton';

export function CareersSectionNav() {
  const { pathname } = useLocation();
  const onApplied = pathname.startsWith(ROUTES.jobsApplied);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
      <RouterButton
        to={ROUTES.jobs}
        variant={onApplied ? 'outlined' : 'contained'}
        size="medium"
      >
        All jobs
      </RouterButton>
      <RouterButton
        to={ROUTES.jobsApplied}
        variant={onApplied ? 'contained' : 'outlined'}
        size="medium"
      >
        Applied jobs
      </RouterButton>
    </Stack>
  );
}
