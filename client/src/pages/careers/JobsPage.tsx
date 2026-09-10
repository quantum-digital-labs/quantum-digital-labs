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
  CareersSectionNav,
  CTASection,
  PageContainer,
  RouterButton,
  SectionHeader,
} from '../../components';
import { ROUTES } from '../../constants';
import {
  JOB_DEPARTMENTS,
  JOB_EXPERIENCES,
  JOB_LOCATIONS,
  JOBS,
  type JobListing,
} from '../../data';
import { useContentList, useMyApplications } from '../../hooks';
import { fetchJobs } from '../../services';

export function JobsPage() {
  const { hasAppliedJob } = useMyApplications();
  const { items: jobs } = useContentList(fetchJobs, JOBS);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');
  const [department, setDepartment] = useState('all');
  const [experience, setExperience] = useState('all');

  const locationOptions = useMemo(
    () => [...new Set([...JOB_LOCATIONS, ...jobs.map((job) => job.location)].filter(Boolean))],
    [jobs],
  );
  const departmentOptions = useMemo(
    () => [
      ...new Set([...JOB_DEPARTMENTS, ...jobs.map((job) => job.department)].filter(Boolean)),
    ],
    [jobs],
  );
  const experienceOptions = useMemo(
    () => [
      ...new Set([...JOB_EXPERIENCES, ...jobs.map((job) => job.experience)].filter(Boolean)),
    ],
    [jobs],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.skills?.some((skill) => skill.toLowerCase().includes(query)) ||
        job.summary.toLowerCase().includes(query);
      const matchesLocation = location === 'all' || job.location === location;
      const matchesDepartment =
        department === 'all' || job.department === department;
      const matchesExperience =
        experience === 'all' || job.experience === experience;
      return (
        matchesSearch && matchesLocation && matchesDepartment && matchesExperience
      );
    });
  }, [jobs, search, location, department, experience]);

  const clearFilters = () => {
    setSearch('');
    setLocation('all');
    setDepartment('all');
    setExperience('all');
  };

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Careers' },
        ]}
      />
      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Open Roles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore current openings at Quantum Digital Labs. Open any role for full
          details, then use Apply to submit your application.
        </Typography>
      </Stack>

      <CareersSectionNav />

      <SectionHeader
        title="Find a role"
        subtitle="Filter by keyword, location, department, or experience level."
      />
      <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Search jobs"
            placeholder="Title, skill, or keyword"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <MenuItem value="all">All locations</MenuItem>
            {locationOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <MenuItem value="all">All departments</MenuItem>
            {departmentOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
          >
            <MenuItem value="all">All experience</MenuItem>
            {experienceOptions.map((item) => (
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
          {filtered.length} open {filtered.length === 1 ? 'role' : 'roles'}
        </Typography>
        {(search ||
          location !== 'all' ||
          department !== 'all' ||
          experience !== 'all') && (
          <Button onClick={clearFilters} size="small">
            Clear filters
          </Button>
        )}
      </Stack>

      {filtered.length === 0 ? (
        <Stack spacing={2} sx={emptyStateSx}>
          <Typography color="text.secondary">
            No roles match your filters. Try clearing filters or searching a different
            keyword.
          </Typography>
          <Button onClick={clearFilters} variant="outlined" sx={{ alignSelf: 'flex-start' }}>
            Clear filters
          </Button>
        </Stack>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((job) => (
            <Grid key={job.id} size={{ xs: 12, md: 6 }}>
              <RoleCard job={job} alreadyApplied={hasAppliedJob(job.id)} />
            </Grid>
          ))}
        </Grid>
      )}

      <CTASection
        title="Hiring for your team?"
        primaryLabel="Contact Us"
        primaryTo={ROUTES.contact}
        secondaryLabel="Back Home"
        secondaryTo={ROUTES.home}
      />
    </PageContainer>
  );
}

function RoleCard({ job, alreadyApplied }: { job: JobListing; alreadyApplied: boolean }) {
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
                {job.department}
              </Typography>
              {alreadyApplied ? (
                <Chip size="small" label="Applied" color="success" />
              ) : null}
            </Stack>
            <Typography variant="h5" component="h2">
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.summary}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Chip size="small" label={job.location} />
            <Chip size="small" label={job.jobType} color="primary" variant="outlined" />
            <Chip size="small" label={job.experience} color="secondary" variant="outlined" />
            {job.workMode ? (
              <Chip size="small" label={job.workMode} variant="outlined" />
            ) : null}
            {typeof job.openings === 'number' ? (
              <Chip size="small" label={`${job.openings} opening${job.openings === 1 ? '' : 's'}`} />
            ) : null}
            {job.salary ? (
              <Chip size="small" label={job.salary} color="success" variant="outlined" />
            ) : null}
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Key skills
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {(job.skills ?? []).slice(0, 4).map((skill) => (
                <Chip key={skill} size="small" label={skill} variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <Divider />
      <CardActions sx={{ px: 2.5, py: 1.75, gap: 1 }}>
        <RouterButton to={ROUTES.jobDetail(job.id)} variant="outlined" size="small">
          View details
        </RouterButton>
        {alreadyApplied ? (
          <Button variant="contained" size="small" disabled>
            Applied
          </Button>
        ) : (
          <RouterButton to={ROUTES.jobApply(job.id)} variant="contained" size="small">
            Apply now
          </RouterButton>
        )}
      </CardActions>
    </Card>
  );
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
