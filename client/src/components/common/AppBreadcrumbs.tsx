import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Use on dark hero backgrounds. */
  tone?: 'default' | 'light';
}

export function AppBreadcrumbs({ items, tone = 'default' }: AppBreadcrumbsProps) {
  const isLight = tone === 'light';

  return (
    <Breadcrumbs
      aria-label="Breadcrumb"
      sx={{
        mb: 2,
        color: isLight ? 'rgba(255,255,255,0.78)' : 'text.secondary',
        '& .MuiBreadcrumbs-separator': {
          color: isLight ? 'rgba(255,255,255,0.55)' : undefined,
        },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.to) {
          return (
            <Typography
              key={`${item.label}-${index}`}
              color={isLight ? 'common.white' : 'text.primary'}
              variant="body2"
            >
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            key={`${item.label}-${index}`}
            component={RouterLink}
            to={item.to}
            underline="hover"
            color="inherit"
            variant="body2"
            sx={isLight ? { color: 'rgba(255,255,255,0.86)' } : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
