import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import {
  AppBreadcrumbs,
  CTASection,
  InternshipsSectionNav,
  PageContainer,
  RouterButton,
  SectionHeader,
} from '../../components';
import { ROUTES } from '../../constants';
import {
  INTERNSHIP_DOMAINS,
  INTERNSHIPS,
  type InternshipProgram,
} from '../../data';
import { useContentList, useMyApplications } from '../../hooks';
import { fetchInternships } from '../../services';

export function InternshipsPage() {
  const { hasAppliedInternship } = useMyApplications();
  const { items: internships } = useContentList(fetchInternships, INTERNSHIPS);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('all');

  const domainOptions = useMemo(() => {
    const fromItems = internships.map((item) => item.domain).filter(Boolean);
    return [...new Set([...INTERNSHIP_DOMAINS, ...fromItems])].sort();
  }, [internships]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return internships.filter((item) => {
      const matchesSearch =
        !query ||
        item.role.toLowerCase().includes(query) ||
        item.domain.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.technologies.some((tech) => tech.toLowerCase().includes(query));
      const matchesDomain = domain === 'all' || item.domain === domain;
      return matchesSearch && matchesDomain;
    });
  }, [internships, search, domain]);

  const clearFilters = () => {
    setSearch('');
    setDomain('all');
  };

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Internships' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Internship Roles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose an internship role, review the details and tech stack, then apply.
          Flow: Internships → Role → Apply.
        </Typography>
      </Stack>

      <InternshipsSectionNav />

      <SectionHeader
        title="Browse roles"
        subtitle="Filter by keyword or domain to find the internship role that fits you."
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            label="Search roles"
            placeholder="Role, domain, or technology"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          >
            <MenuItem value="all">All domains</MenuItem>
            {domainOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {filtered.length} internship {filtered.length === 1 ? 'role' : 'roles'}
        </Typography>
        {(search || domain !== 'all') && (
          <Button onClick={clearFilters} size="small">
            Clear filters
          </Button>
        )}
      </Stack>

      {filtered.length === 0 ? (
        <Stack spacing={2} sx={emptyStateSx}>
          <Typography color="text.secondary">
            No internship roles match your filters.
          </Typography>
          <Button
            onClick={clearFilters}
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          >
            Clear filters
          </Button>
        </Stack>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((item) => (
            <Grid key={item.id} size={{ xs: 12, md: 6 }}>
              <InternshipRoleCard
                item={item}
                alreadyApplied={hasAppliedInternship(item.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CTASection
        title="Questions about internships?"
        primaryLabel="Contact Us"
        primaryTo={ROUTES.contact}
        secondaryLabel="Back Home"
        secondaryTo={ROUTES.home}
      />
    </PageContainer>
  );
}

function InternshipRoleCard({
  item,
  alreadyApplied,
}: {
  item: InternshipProgram;
  alreadyApplied: boolean;
}) {
  return (
    <Card elevation={0} sx={roleCardSx}>
      <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1.5 }}>
        <Stack spacing={1.75} sx={{ height: '100%' }}>
          <Stack spacing={0.75}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant="caption" color="secondary" sx={{ fontWeight: 700 }}>
                {item.domain}
              </Typography>
              {alreadyApplied ? (
                <Chip size="small" label="Applied" color="success" />
              ) : null}
            </Stack>
            <Typography variant="h5" component="h2">
              {item.role}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.summary}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Chip size="small" label={item.duration} />
            <Chip size="small" label={item.mode} color="primary" variant="outlined" />
            {item.workMode ? (
              <Chip size="small" label={item.workMode} variant="outlined" />
            ) : null}
            {typeof item.openings === 'number' ? (
              <Chip
                size="small"
                label={`${item.openings} opening${item.openings === 1 ? '' : 's'}`}
              />
            ) : null}
            {item.stipend ? (
              <Chip size="small" label={item.stipend} color="success" variant="outlined" />
            ) : null}
            {item.startDate ? (
              <Chip
                size="small"
                label={`Starts ${formatDateChip(item.startDate)}`}
                variant="outlined"
              />
            ) : null}
            {item.endDate || item.applicationDeadline ? (
              <Chip
                size="small"
                label={`Ends ${formatDateChip(item.endDate ?? item.applicationDeadline!)}`}
                variant="outlined"
              />
            ) : null}
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Tech stack
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {item.technologies.slice(0, 4).map((tech) => (
                <Chip key={tech} size="small" label={tech} variant="outlined" />
              ))}
              {item.technologies.length > 4 ? (
                <Chip
                  size="small"
                  label={`+${item.technologies.length - 4}`}
                  variant="outlined"
                />
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <Divider />
      <CardActions sx={{ px: 2.5, py: 1.75, gap: 1 }}>
        <RouterButton to={ROUTES.internshipDetail(item.id)} variant="outlined" size="small">
          View details
        </RouterButton>
        {alreadyApplied ? (
          <Button variant="contained" size="small" disabled>
            Applied
          </Button>
        ) : (
          <RouterButton to={ROUTES.internshipApply(item.id)} variant="contained" size="small">
            Apply now
          </RouterButton>
        )}
      </CardActions>
    </Card>
  );
}

function formatDateChip(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const roleCardSx = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: 3,
  },
} as const;

const emptyStateSx = {
  p: 3,
  borderRadius: 2,
  border: '1px dashed',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
