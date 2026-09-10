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
  InternshipsSectionNav,
  PageContainer,
  RouterButton,
} from '../../components';
import { ROUTES } from '../../constants';
import { getInternshipById } from '../../data';
import { fetchMyApplications, type TrackedInternshipApplication } from '../../services';

const STATUS_LABEL: Record<TrackedInternshipApplication['status'], string> = {
  received: 'Received',
  reviewing: 'Under review',
  shortlisted: 'Shortlisted',
  rejected: 'Not selected',
  selected: 'Selected',
};

const STATUS_COLOR: Record<
  TrackedInternshipApplication['status'],
  'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'
> = {
  received: 'info',
  reviewing: 'warning',
  shortlisted: 'primary',
  rejected: 'error',
  selected: 'success',
};

const TRACK_STEPS = ['Received', 'Under review', 'Shortlisted', 'Selected'] as const;

function stepIndex(status: TrackedInternshipApplication['status']): number {
  if (status === 'received') return 0;
  if (status === 'reviewing') return 1;
  if (status === 'shortlisted') return 2;
  if (status === 'selected') return 3;
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

export function AppliedInternshipsPage() {
  const [items, setItems] = useState<TrackedInternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchMyApplications()
      .then((data) => {
        if (cancelled) return;
        setItems(data.internships ?? []);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'Could not load applied internships.',
        );
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
          { label: 'Internships', to: ROUTES.internships },
          { label: 'Applied internships' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Applied internships
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track every internship you have applied for, including reference number and
          current status.
        </Typography>
      </Stack>

      <InternshipsSectionNav />

      {loading ? (
        <Typography color="text.secondary">Loading your applications…</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : items.length === 0 ? (
        <Stack spacing={2} sx={emptySx}>
          <Typography color="text.secondary">
            You have not applied for any internships yet. Browse open roles to get
            started.
          </Typography>
          <RouterButton
            to={ROUTES.internships}
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            View all internships
          </RouterButton>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.map((application) => {
            const internship = getInternshipById(application.internshipId);
            const title = internship?.role ?? application.internshipId;
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
                          {internship
                            ? `${internship.domain} · ${internship.duration} · ${internship.mode}`
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
                        This application was not selected. You can browse other open
                        internships.
                      </Typography>
                    ) : (
                      <Stepper
                        activeStep={stepIndex(application.status)}
                        alternativeLabel
                        sx={{ pt: 1 }}
                      >
                        {TRACK_STEPS.map((label) => (
                          <Step
                            key={label}
                            completed={
                              application.status === 'selected' && label === 'Selected'
                            }
                          >
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      {internship ? (
                        <RouterButton
                          to={ROUTES.internshipDetail(internship.id)}
                          variant="outlined"
                          size="small"
                        >
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
