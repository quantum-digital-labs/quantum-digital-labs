import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AppBreadcrumbs,
  PageContainer,
} from '../../components';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  fetchAdminApplications,
  updateInternshipApplicationStatus,
  updateJobApplicationStatus,
  type AdminApplicationRow,
  type InternshipApplicationStatus,
  type JobApplicationStatus,
} from '../../services';

const JOB_STATUS_OPTIONS: { value: JobApplicationStatus; label: string }[] = [
  { value: 'received', label: 'Received' },
  { value: 'reviewing', label: 'Under review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Not selected' },
  { value: 'hired', label: 'Hired' },
];

const INTERNSHIP_STATUS_OPTIONS: { value: InternshipApplicationStatus; label: string }[] = [
  { value: 'received', label: 'Received' },
  { value: 'reviewing', label: 'Under review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Not selected' },
  { value: 'selected', label: 'Selected' },
];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ApplicationsAdminPage() {
  const [tab, setTab] = useState(0);
  const [jobs, setJobs] = useState<AdminApplicationRow[]>([]);
  const [internships, setInternships] = useState<AdminApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingRef, setSavingRef] = useState<string | null>(null);
  const alert = useAlertPopup();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminApplications();
      setJobs(data.jobs);
      setInternships(data.internships);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const changeJobStatus = async (row: AdminApplicationRow, status: JobApplicationStatus) => {
    if (row.status === status) return;
    setSavingRef(row.referenceNumber);
    try {
      const result = await updateJobApplicationStatus(row.referenceNumber, status);
      setJobs((prev) =>
        prev.map((item) =>
          item.referenceNumber === row.referenceNumber
            ? { ...item, status: result.status }
            : item,
        ),
      );
      alert.show({
        title: result.emailed ? 'Status updated' : 'No change',
        message: result.emailed
          ? `${row.fullName} has been emailed that their job application is now ${labelFor(JOB_STATUS_OPTIONS, result.status)}.`
          : 'Status was already set to this value.',
        severity: result.emailed ? 'success' : 'info',
      });
    } catch (err: unknown) {
      alert.show({
        title: 'Status not updated',
        message: err instanceof Error ? err.message : 'Could not update status.',
        severity: 'error',
      });
    } finally {
      setSavingRef(null);
    }
  };

  const changeInternshipStatus = async (
    row: AdminApplicationRow,
    status: InternshipApplicationStatus,
  ) => {
    if (row.status === status) return;
    setSavingRef(row.referenceNumber);
    try {
      const result = await updateInternshipApplicationStatus(row.referenceNumber, status);
      setInternships((prev) =>
        prev.map((item) =>
          item.referenceNumber === row.referenceNumber
            ? { ...item, status: result.status }
            : item,
        ),
      );
      alert.show({
        title: result.emailed ? 'Status updated' : 'No change',
        message: result.emailed
          ? `${row.fullName} has been emailed that their internship application is now ${labelFor(INTERNSHIP_STATUS_OPTIONS, result.status)}.`
          : 'Status was already set to this value.',
        severity: result.emailed ? 'success' : 'info',
      });
    } catch (err: unknown) {
      alert.show({
        title: 'Status not updated',
        message: err instanceof Error ? err.message : 'Could not update status.',
        severity: 'error',
      });
    } finally {
      setSavingRef(null);
    }
  };

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Admin', to: ROUTES.admin },
          { label: 'Applications' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography component="h1" variant="h2">
          Application status
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Move a job or internship application to the next stage. The applicant is emailed
          whenever the status changes.
        </Typography>
      </Stack>

      <Tabs value={tab} onChange={(_event, value: number) => setTab(value)}>
        <Tab label={`Jobs (${jobs.length})`} />
        <Tab label={`Internships (${internships.length})`} />
      </Tabs>

      {loading ? (
        <Typography color="text.secondary">Loading applications…</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : tab === 0 ? (
        <ApplicationList
          items={jobs}
          options={JOB_STATUS_OPTIONS}
          savingRef={savingRef}
          onChange={(row, status) =>
            void changeJobStatus(row, status as JobApplicationStatus)
          }
          empty="No job applications yet."
        />
      ) : (
        <ApplicationList
          items={internships}
          options={INTERNSHIP_STATUS_OPTIONS}
          savingRef={savingRef}
          onChange={(row, status) =>
            void changeInternshipStatus(row, status as InternshipApplicationStatus)
          }
          empty="No internship applications yet."
        />
      )}

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={alert.close}
      />
    </PageContainer>
  );
}

function ApplicationList({
  items,
  options,
  savingRef,
  onChange,
  empty,
}: {
  items: AdminApplicationRow[];
  options: { value: string; label: string }[];
  savingRef: string | null;
  onChange: (row: AdminApplicationRow, status: string) => void;
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <Typography color="text.secondary" sx={emptySx}>
        {empty}
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((row) => (
        <Card key={row.referenceNumber} elevation={0} sx={cardSx}>
          <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ justifyContent: 'space-between' }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h5">{row.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.fullName} · {row.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.referenceNumber} · Applied {formatDate(row.appliedAt)}
                  </Typography>
                </Stack>
                <TextField
                  select
                  label="Status"
                  value={row.status}
                  disabled={savingRef === row.referenceNumber}
                  onChange={(event) => {
                    // Release MenuItem focus before any success/error dialog opens
                    // (avoids aria-hidden on focused Select menu descendants).
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                    onChange(row, event.target.value);
                  }}
                  slotProps={{
                    select: {
                      MenuProps: {
                        disableAutoFocusItem: true,
                        TransitionProps: {
                          onExited: () => {
                            if (document.activeElement instanceof HTMLElement) {
                              document.activeElement.blur();
                            }
                          },
                        },
                      },
                    },
                  }}
                  sx={{ minWidth: 200 }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function labelFor(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
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
