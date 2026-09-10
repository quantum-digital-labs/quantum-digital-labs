import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import {
  AppBreadcrumbs,
  CareersSectionNav,
  PageContainer,
  RouterButton,
} from '../../components';
import { ROUTES } from '../../constants';
import { getJobById } from '../../data';
import { fetchMyApplications, type TrackedJobApplication } from '../../services';

const STATUS_LABEL: Record<TrackedJobApplication['status'], string> = {
  received: 'Received',
  reviewing: 'Under review',
  shortlisted: 'Shortlisted',
  rejected: 'Not selected',
  hired: 'Hired',
};

const STATUS_COLOR: Record<
  TrackedJobApplication['status'],
  'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'
> = {
  received: 'info',
  reviewing: 'warning',
  shortlisted: 'primary',
  rejected: 'error',
  hired: 'success',
};

const TRACK_STEPS = ['Received', 'Under review', 'Shortlisted', 'Hired'] as const;

function stepIndex(status: TrackedJobApplication['status']): number {
  if (status === 'received') return 0;
  if (status === 'reviewing') return 1;
  if (status === 'shortlisted') return 2;
  if (status === 'hired') return 3;
  return 1;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AppliedJobsPage() {
  const [items, setItems] = useState<TrackedJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchMyApplications()
      .then((data) => {
        if (cancelled) return;
        setItems(data.jobs ?? []);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load applied jobs.');
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Careers', to: ROUTES.jobs },
          { label: 'Applied jobs' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Applied jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track every role you have applied for, including reference number and current
          status.
        </Typography>
      </Stack>

      <CareersSectionNav />

      {loading ? (
        <Typography color="text.secondary">Loading your applications…</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : items.length === 0 ? (
        <Stack spacing={2} sx={emptySx}>
          <Typography color="text.secondary">
            You have not applied for any jobs yet. Browse open roles to get started.
          </Typography>
          <RouterButton to={ROUTES.jobs} variant="contained" sx={{ alignSelf: 'flex-start' }}>
            View all jobs
          </RouterButton>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.map((application) => {
            const job = getJobById(application.jobId);
            const title = job?.title ?? application.jobId;
            const rejected = application.status === 'rejected';

            return (
              <Card key={application.referenceNumber} elevation={0} sx={cardSx}>
                <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' } }}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant="h5">{title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job
                            ? `${job.department} · ${job.location} · ${job.jobType}`
                            : 'Role details unavailable'}
                        </Typography>
                      </Stack>
                      <Chip
                        label={STATUS_LABEL[application.status]}
                        color={STATUS_COLOR[application.status]}
                        sx={{ fontWeight: 700, alignSelf: { sm: 'flex-start' } }}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Meta label="Reference" value={application.referenceNumber} />
                      <Meta label="Applied on" value={formatDate(application.appliedAt)} />
                    </Stack>

                    {rejected ? (
                      <Typography variant="body2" color="error">
                        This application was not selected. You can browse other open roles.
                      </Typography>
                    ) : (
                      <Stepper
                        activeStep={stepIndex(application.status)}
                        alternativeLabel
                        sx={{ pt: 1 }}
                      >
                        {TRACK_STEPS.map((label) => (
                          <Step key={label} completed={application.status === 'hired' && label === 'Hired'}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      {job ? (
                        <RouterButton to={ROUTES.jobDetail(job.id)} variant="outlined" size="small">
                          View role
                        </RouterButton>
                      ) : null}
                      <Button variant="contained" size="small" disabled>
                        Applied
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </PageContainer>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

const cardSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
} as const;

const emptySx = {
  p: 3,
  border: '1px dashed',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
} as const;
