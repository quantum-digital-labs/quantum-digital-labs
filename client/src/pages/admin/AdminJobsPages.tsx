import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { AlertDialog } from '../../components';
import {
  JOB_DEPARTMENT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_LOCATION_OPTIONS,
  JOB_TYPE_OPTIONS,
  JOB_WORK_MODE_OPTIONS,
  listToParagraph,
  paragraphToList,
} from '../../constants/jobCatalog';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  createJob,
  fetchJob,
  updateJob,
  type JobContent,
} from '../../services';
import { AdminContentListPage } from './AdminContentListPage';

export function AdminJobsList() {
  return (
    <AdminContentListPage
      kind="jobs"
      title="Jobs"
      subtitle="Post careers openings. They appear on the public Jobs pages when published."
      createLabel="Post job"
    />
  );
}

export function AdminJobEditor() {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === 'new';
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [jobId, setJobId] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [department, setDepartment] = useState<string>(JOB_DEPARTMENT_OPTIONS[0]);
  const [location, setLocation] = useState<string>(JOB_LOCATION_OPTIONS[0]);
  const [experience, setExperience] = useState<string>(JOB_EXPERIENCE_OPTIONS[0]);
  const [jobType, setJobType] = useState<string>(JOB_TYPE_OPTIONS[0]);
  const [skills, setSkills] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [openings, setOpenings] = useState('');
  const [salary, setSalary] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !routeId) return;
    let cancelled = false;
    setLoading(true);
    fetchJob(routeId)
      .then((job) => {
        if (cancelled) return;
        fillForm(job);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Could not load job.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isNew, routeId]);

  const fillForm = (job: JobContent) => {
    setJobId(job.id);
    setTitle(job.title ?? '');
    setSummary(job.summary ?? '');
    setDepartment(job.department ?? JOB_DEPARTMENT_OPTIONS[0]);
    setLocation(job.location ?? JOB_LOCATION_OPTIONS[0]);
    setExperience(job.experience ?? JOB_EXPERIENCE_OPTIONS[0]);
    setJobType(job.jobType ?? JOB_TYPE_OPTIONS[0]);
    setSkills(listToParagraph(job.skills));
    setResponsibilities(listToParagraph(job.responsibilities));
    setRequirements(listToParagraph(job.requirements));
    setBenefits(listToParagraph(job.benefits));
    setOpenings(
      typeof job.openings === 'number' && Number.isFinite(job.openings)
        ? String(job.openings)
        : '',
    );
    setSalary(job.salary ?? '');
    setApplicationDeadline(job.applicationDeadline ?? '');
    setWorkMode(job.workMode ?? '');
    setPublished(job.published !== false);
  };

  const onSave = async () => {
    if (!title.trim() || !summary.trim()) {
      alert.show({
        title: 'Missing fields',
        message: 'Title and summary are required.',
        severity: 'warning',
      });
      return;
    }

    const openingsValue = openings.trim();
    const openingsNumber = openingsValue ? Number(openingsValue) : undefined;
    if (
      openingsValue &&
      (!Number.isInteger(openingsNumber) || (openingsNumber ?? 0) < 1)
    ) {
      alert.show({
        title: 'Invalid openings',
        message: 'Openings must be a positive whole number.',
        severity: 'warning',
      });
      return;
    }

    const payload: JobContent = {
      id: isNew ? 'auto' : jobId,
      title: title.trim(),
      summary: summary.trim(),
      department,
      location,
      experience,
      jobType,
      skills: paragraphToList(skills),
      responsibilities: paragraphToList(responsibilities),
      requirements: paragraphToList(requirements),
      benefits: paragraphToList(benefits),
      published,
      ...(openingsNumber ? { openings: openingsNumber } : {}),
      ...(salary.trim() ? { salary: salary.trim() } : {}),
      ...(applicationDeadline.trim()
        ? { applicationDeadline: applicationDeadline.trim() }
        : {}),
      ...(workMode.trim() ? { workMode: workMode.trim() } : {}),
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createJob(payload);
        setJobId(created.id);
        alert.show({
          title: 'Job posted',
          message: `Job created with ID ${created.id}.`,
          severity: 'success',
        });
      } else {
        await updateJob(routeId!, payload);
        alert.show({
          title: 'Saved',
          message: 'Job updated successfully.',
          severity: 'success',
        });
      }
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save job.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (loadError) {
    return (
      <Stack spacing={2}>
        <Typography color="error">{loadError}</Typography>
        <Button component={RouterLink} to={ROUTES.adminJobs} variant="outlined">
          Back
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 860 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
          {isNew ? 'Post job' : `Edit ${title || routeId}`}
        </Typography>
        <Button component={RouterLink} to={ROUTES.adminJobs} variant="outlined">
          Cancel
        </Button>
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
        Required fields
      </Typography>

      <TextField
        label="Job title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Job ID"
        value={isNew ? 'Auto-generated on save (QDLJB-0001, …)' : jobId}
        disabled
        fullWidth
        helperText={
          isNew
            ? 'Server assigns the next ID: QDLJB-0001, QDLJB-0002, …'
            : 'Business job ID (cannot be changed).'
        }
      />

      <TextField
        label="Summary"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="Short intro shown on job cards and the detail page."
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            fullWidth
            required
          >
            {JOB_DEPARTMENT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            fullWidth
            required
          >
            {JOB_LOCATION_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            fullWidth
            required
            helperText="Must match apply-form bands."
          >
            {JOB_EXPERIENCE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Job type"
            value={jobType}
            onChange={(event) => setJobType(event.target.value)}
            fullWidth
            required
          >
            {JOB_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TextField
        label="Skills"
        value={skills}
        onChange={(event) => setSkills(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="One skill per line."
      />
      <TextField
        label="Responsibilities"
        value={responsibilities}
        onChange={(event) => setResponsibilities(event.target.value)}
        multiline
        minRows={4}
        fullWidth
        required
        helperText="One responsibility per line."
      />
      <TextField
        label="Requirements"
        value={requirements}
        onChange={(event) => setRequirements(event.target.value)}
        multiline
        minRows={4}
        fullWidth
        required
        helperText="One requirement per line."
      />
      <TextField
        label="Benefits"
        value={benefits}
        onChange={(event) => setBenefits(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="One benefit per line."
      />

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, pt: 1 }}>
        Optional extras
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Openings"
            value={openings}
            onChange={(event) =>
              setOpenings(event.target.value.replace(/\D/g, '').slice(0, 4))
            }
            fullWidth
            helperText="Number of positions (optional)."
            inputMode="numeric"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Work mode"
            value={workMode}
            onChange={(event) => setWorkMode(event.target.value)}
            fullWidth
            helperText="Optional. Separate from location."
          >
            <MenuItem value="">
              <em>Not specified</em>
            </MenuItem>
            {JOB_WORK_MODE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Salary / CTC"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            fullWidth
            helperText="Optional. e.g. 4–6 LPA or Competitive"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Application deadline"
            type="date"
            value={applicationDeadline}
            onChange={(event) => setApplicationDeadline(event.target.value)}
            fullWidth
            helperText="Optional."
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>

      <FormControlLabel
        control={
          <Checkbox
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
        }
        label="Published on public website"
      />

      <Button
        variant="contained"
        onClick={() => void onSave()}
        disabled={saving}
        sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
      >
        {saving ? 'Saving…' : isNew ? 'Post job' : 'Save changes'}
      </Button>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => {
          alert.close();
          if (alert.severity === 'success') {
            navigate(ROUTES.adminJobs);
          }
        }}
      />
    </Stack>
  );
}
