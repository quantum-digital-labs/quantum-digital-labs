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
  INTERNSHIP_DOMAIN_OPTIONS,
  INTERNSHIP_DURATION_OPTIONS,
  INTERNSHIP_MODE_OPTIONS,
  INTERNSHIP_WORK_MODE_OPTIONS,
  listToParagraph,
  paragraphToList,
} from '../../constants/internshipCatalog';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  createInternship,
  fetchInternship,
  updateInternship,
  type InternshipContent,
} from '../../services';
import { AdminContentListPage } from './AdminContentListPage';

export function AdminInternshipsList() {
  return (
    <AdminContentListPage
      kind="internships"
      title="Internships"
      subtitle="Post internship programs. They appear on the public Internships pages when published."
      createLabel="Post internship"
    />
  );
}

export function AdminInternshipEditor() {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === 'new';
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [internshipId, setInternshipId] = useState('');
  const [role, setRole] = useState('');
  const [summary, setSummary] = useState('');
  const [domain, setDomain] = useState<string>(INTERNSHIP_DOMAIN_OPTIONS[0]);
  const [durationPreset, setDurationPreset] = useState<string>(
    INTERNSHIP_DURATION_OPTIONS[2],
  );
  const [durationCustom, setDurationCustom] = useState('');
  const [mode, setMode] = useState<string>(INTERNSHIP_MODE_OPTIONS[0]);
  const [technologies, setTechnologies] = useState('');
  const [skills, setSkills] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [projects, setProjects] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [benefits, setBenefits] = useState('');
  const [certificate, setCertificate] = useState(
    'Certificate of completion upon successful program finish',
  );
  const [openings, setOpenings] = useState('');
  const [stipend, setStipend] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !routeId) return;
    let cancelled = false;
    setLoading(true);
    fetchInternship(routeId)
      .then((item) => {
        if (cancelled) return;
        fillForm(item);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Could not load internship.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isNew, routeId]);

  const fillForm = (item: InternshipContent) => {
    setInternshipId(item.id);
    setRole(item.role ?? item.title ?? '');
    setSummary(item.summary ?? '');
    setDomain(item.domain ?? INTERNSHIP_DOMAIN_OPTIONS[0]);
    const durationValue = item.duration ?? '';
    if (
      INTERNSHIP_DURATION_OPTIONS.includes(
        durationValue as (typeof INTERNSHIP_DURATION_OPTIONS)[number],
      )
    ) {
      setDurationPreset(durationValue);
      setDurationCustom('');
    } else if (durationValue) {
      setDurationPreset('Custom');
      setDurationCustom(durationValue);
    } else {
      setDurationPreset(INTERNSHIP_DURATION_OPTIONS[2]);
      setDurationCustom('');
    }
    setMode(item.mode ?? INTERNSHIP_MODE_OPTIONS[0]);
    setTechnologies(listToParagraph(item.technologies));
    setSkills(listToParagraph(item.skills));
    setEligibility(listToParagraph(item.eligibility));
    setResponsibilities(listToParagraph(item.responsibilities));
    setProjects(listToParagraph(item.projects));
    setLearningOutcomes(listToParagraph(item.learningOutcomes));
    setBenefits(listToParagraph(item.benefits));
    setCertificate(
      item.certificate ||
        'Certificate of completion upon successful program finish',
    );
    setOpenings(
      typeof item.openings === 'number' && Number.isFinite(item.openings)
        ? String(item.openings)
        : '',
    );
    setStipend(item.stipend ?? '');
    setStartDate(toDateInputValue(item.startDate));
    setEndDate(toDateInputValue(item.endDate ?? item.applicationDeadline));
    setWorkMode(item.workMode ?? '');
    setPublished(item.published !== false);
  };

  const resolvedDuration =
    durationPreset === 'Custom' ? durationCustom.trim() : durationPreset;

  const onSave = async () => {
    if (!role.trim() || !summary.trim()) {
      alert.show({
        title: 'Missing fields',
        message: 'Role title and summary are required.',
        severity: 'warning',
      });
      return;
    }
    if (!resolvedDuration) {
      alert.show({
        title: 'Duration required',
        message: 'Select a duration or enter a custom value.',
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

    if (startDate && endDate && endDate < startDate) {
      alert.show({
        title: 'Invalid dates',
        message: 'End date cannot be before the start date.',
        severity: 'warning',
      });
      return;
    }

    const payload: InternshipContent = {
      id: isNew ? 'auto' : internshipId,
      role: role.trim(),
      title: role.trim(),
      summary: summary.trim(),
      domain,
      duration: resolvedDuration,
      mode,
      technologies: paragraphToList(technologies),
      skills: paragraphToList(skills),
      eligibility: paragraphToList(eligibility),
      responsibilities: paragraphToList(responsibilities),
      projects: paragraphToList(projects),
      learningOutcomes: paragraphToList(learningOutcomes),
      benefits: paragraphToList(benefits),
      certificate: certificate.trim(),
      published,
      ...(openingsNumber ? { openings: openingsNumber } : {}),
      ...(stipend.trim() ? { stipend: stipend.trim() } : {}),
      ...(startDate.trim() ? { startDate: startDate.trim() } : {}),
      ...(endDate.trim() ? { endDate: endDate.trim() } : {}),
      ...(workMode.trim() ? { workMode: workMode.trim() } : {}),
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createInternship(payload);
        setInternshipId(created.id);
        alert.show({
          title: 'Internship posted',
          message: `Internship created with ID ${created.id}.`,
          severity: 'success',
        });
      } else {
        await updateInternship(routeId!, payload);
        alert.show({
          title: 'Saved',
          message: 'Internship updated successfully.',
          severity: 'success',
        });
      }
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save internship.',
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
        <Button component={RouterLink} to={ROUTES.adminInternships} variant="outlined">
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
          {isNew ? 'Post internship' : `Edit ${role || routeId}`}
        </Typography>
        <Button component={RouterLink} to={ROUTES.adminInternships} variant="outlined">
          Cancel
        </Button>
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
        Required fields
      </Typography>

      <TextField
        label="Role title"
        value={role}
        onChange={(event) => setRole(event.target.value)}
        required
        fullWidth
        helperText="Shown as the main internship title on the public site."
      />

      <TextField
        label="Internship ID"
        value={isNew ? 'Auto-generated on save (QDLIN-0001, …)' : internshipId}
        disabled
        fullWidth
        helperText={
          isNew
            ? 'Server assigns the next ID: QDLIN-0001, QDLIN-0002, …'
            : 'Business internship ID (cannot be changed).'
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
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            fullWidth
            required
          >
            {INTERNSHIP_DOMAIN_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Mode"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            fullWidth
            required
          >
            {INTERNSHIP_MODE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Duration"
            value={durationPreset}
            onChange={(event) => setDurationPreset(event.target.value)}
            fullWidth
            required
          >
            {INTERNSHIP_DURATION_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {durationPreset === 'Custom' ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Custom duration"
              value={durationCustom}
              onChange={(event) => setDurationCustom(event.target.value)}
              fullWidth
              required
              placeholder="e.g. 10 weeks"
            />
          </Grid>
        ) : null}
      </Grid>

      <TextField
        label="Technologies"
        value={technologies}
        onChange={(event) => setTechnologies(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="One technology per line."
      />
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
        label="Eligibility"
        value={eligibility}
        onChange={(event) => setEligibility(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="One eligibility point per line."
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
        label="Projects"
        value={projects}
        onChange={(event) => setProjects(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="One project per line."
      />
      <TextField
        label="Learning outcomes"
        value={learningOutcomes}
        onChange={(event) => setLearningOutcomes(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="One outcome per line."
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
      <TextField
        label="Certificate text"
        value={certificate}
        onChange={(event) => setCertificate(event.target.value)}
        multiline
        minRows={2}
        fullWidth
        required
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
            helperText="Number of seats (optional)."
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
            helperText="Optional. Separate from Mode if needed."
          >
            <MenuItem value="">
              <em>Not specified</em>
            </MenuItem>
            {INTERNSHIP_WORK_MODE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Stipend"
            value={stipend}
            onChange={(event) => setStipend(event.target.value)}
            fullWidth
            helperText="Optional. e.g. Unpaid / 5k–10k / Performance-based"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={(event) => {
              const nextStart = event.target.value;
              setStartDate(nextStart);
              if (endDate && nextStart && endDate < nextStart) {
                setEndDate('');
              }
            }}
            fullWidth
            helperText="Optional."
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="End date"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            fullWidth
            helperText={
              startDate
                ? 'Optional. Must be on or after the start date.'
                : 'Optional.'
            }
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: startDate ? { min: startDate } : undefined,
            }}
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
        {saving ? 'Saving…' : isNew ? 'Post internship' : 'Save changes'}
      </Button>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => {
          alert.close();
          if (alert.severity === 'success') {
            navigate(ROUTES.adminInternships);
          }
        }}
      />
    </Stack>
  );
}

/** Normalize stored values to YYYY-MM-DD for native date inputs. */
function toDateInputValue(value: string | undefined): string {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return '';
  return new Date(parsed).toISOString().slice(0, 10);
}
