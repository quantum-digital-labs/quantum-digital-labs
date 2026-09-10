import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import {
  AppBreadcrumbs,
  PageContainer,
  RouterButton,
} from '../../components';
import { ROUTES } from '../../constants';
import { getJobById } from '../../data';
import { useContentItem, useMyApplications } from '../../hooks';
import { fetchJob } from '../../services';

export function JobDetailPage() {
  const { jobId = '' } = useParams();
  const { item: job, loading } = useContentItem(jobId, fetchJob, getJobById);
  const { hasAppliedJob } = useMyApplications();
  const alreadyApplied = hasAppliedJob(jobId);

  if (loading && !job) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading role…</Typography>
      </PageContainer>
    );
  }

  if (!job) {
    return <Navigate to={ROUTES.jobs} replace />;
  }

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Careers', to: ROUTES.jobs },
          { label: job.title },
        ]}
      />

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                <Typography
                  variant="caption"
                  color="secondary"
                  sx={{ fontWeight: 700, letterSpacing: 0.4 }}
                >
                  {job.department}
                </Typography>
                {alreadyApplied ? (
                  <Chip size="small" label="Applied" color="success" />
                ) : null}
              </Stack>
              <Typography component="h1" variant="h2">
                {job.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
                {job.summary}
              </Typography>
            </Stack>

            <Box sx={overviewBoxSx}>
              <Grid container spacing={2}>
                <OverviewItem label="Location" value={job.location} />
                <OverviewItem label="Department" value={job.department} />
                <OverviewItem label="Experience" value={job.experience} />
                <OverviewItem label="Job type" value={job.jobType} />
                {job.workMode ? (
                  <OverviewItem label="Work mode" value={job.workMode} />
                ) : null}
                {typeof job.openings === 'number' ? (
                  <OverviewItem label="Openings" value={String(job.openings)} />
                ) : null}
                {job.salary ? <OverviewItem label="Salary / CTC" value={job.salary} /> : null}
                {job.applicationDeadline ? (
                  <OverviewItem
                    label="Apply by"
                    value={formatDeadline(job.applicationDeadline)}
                  />
                ) : null}
              </Grid>
            </Box>

            <DetailSection title="Role overview" description="What you will work on day to day.">
              <DetailList items={job.responsibilities} />
            </DetailSection>

            <DetailSection
              title="Requirements"
              description="What we look for in a strong candidate."
            >
              <DetailList items={job.requirements} />
            </DetailSection>

            <DetailSection title="Skills" description="Core skills used in this role.">
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {(job.skills ?? []).map((skill) => (
                  <Chip key={skill} label={skill} color="primary" variant="outlined" />
                ))}
              </Stack>
            </DetailSection>

            <DetailSection title="Benefits" description="What you can expect from the team.">
              <DetailList items={job.benefits} />
            </DetailSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={applyPanelSx}>
            <Stack spacing={2}>
              <Typography variant="h5">Ready to apply?</Typography>
              <Typography variant="body2" color="text.secondary">
                Submit your basic details, experience, and resume for the{' '}
                <strong>{job.title}</strong> role. It only takes a few minutes.
              </Typography>
              <Divider />
              <Stack spacing={1}>
                <MetaRow label="Location" value={job.location} />
                <MetaRow label="Experience" value={job.experience} />
                <MetaRow label="Type" value={job.jobType} />
                {job.workMode ? <MetaRow label="Work mode" value={job.workMode} /> : null}
                {job.salary ? <MetaRow label="Salary / CTC" value={job.salary} /> : null}
                {typeof job.openings === 'number' ? (
                  <MetaRow label="Openings" value={String(job.openings)} />
                ) : null}
                {job.applicationDeadline ? (
                  <MetaRow
                    label="Apply by"
                    value={formatDeadline(job.applicationDeadline)}
                  />
                ) : null}
              </Stack>
              <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                {alreadyApplied ? (
                  <Button variant="contained" fullWidth disabled>
                    Applied
                  </Button>
                ) : (
                  <RouterButton to={ROUTES.jobApply(job.id)} variant="contained" fullWidth>
                    Apply for this role
                  </RouterButton>
                )}
                <RouterButton to={ROUTES.jobs} variant="outlined" fullWidth>
                  Back to all roles
                </RouterButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

function formatDeadline(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 6, sm: 3, md: 6, lg: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Stack>
    </Grid>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'space-between' }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Box component="section" sx={sectionBoxSx}>
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

function DetailList({ items }: { items: string[] }) {
  return (
    <List dense disablePadding>
      {items.map((item) => (
        <ListItem key={item} sx={{ px: 0, alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
            <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={item}
            slotProps={{
              primary: { variant: 'body2' },
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}

const overviewBoxSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;

const sectionBoxSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;

const applyPanelSx = {
  position: { md: 'sticky' },
  top: { md: 96 },
  p: { xs: 2.5, md: 3 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
