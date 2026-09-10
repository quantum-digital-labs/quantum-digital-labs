import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { RouterButton } from '../common/RouterButton';

export function InternshipsSectionNav() {
  const { pathname } = useLocation();
  const onApplied = pathname.startsWith(ROUTES.internshipsApplied);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
      <RouterButton
        to={ROUTES.internships}
        variant={onApplied ? 'outlined' : 'contained'}
        size="medium"
      >
        All internships
      </RouterButton>
      <RouterButton
        to={ROUTES.internshipsApplied}
        variant={onApplied ? 'contained' : 'outlined'}
        size="medium"
      >
        Applied internships
      </RouterButton>
    </Stack>
  );
}
