import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { AlertDialog } from '../../components';
import { CoverImageField } from '../../components/admin/CoverImageField';
import {
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_TIMELINE_OPTIONS,
  listToParagraph,
  paragraphToList,
} from '../../constants/projectCatalog';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  createProject,
  fetchProject,
  isCustomCoverImage,
  isUploadedImageUrl,
  resolveMediaUrl,
  updateProject,
  uploadProjectScreenshots,
  type ProjectContent,
} from '../../services';
import { AdminContentListPage } from './AdminContentListPage';

export function AdminProjectsList() {
  return (
    <AdminContentListPage
      kind="projects"
      title="Projects"
      subtitle="Post demo projects. They appear on the public Projects pages when published."
      createLabel="Post project"
    />
  );
}

export function AdminProjectEditor() {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === 'new';
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(PROJECT_CATEGORY_OPTIONS[0]);
  const [categoryCustom, setCategoryCustom] = useState('');
  const [clientType, setClientType] = useState('');
  const [timelinePreset, setTimelinePreset] = useState<string>(
    PROJECT_TIMELINE_OPTIONS[4],
  );
  const [timelineCustom, setTimelineCustom] = useState('');
  const [status, setStatus] = useState<string>(PROJECT_STATUS_OPTIONS[0]);
  const [statusCustom, setStatusCustom] = useState('');
  const [overview, setOverview] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [features, setFeatures] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [results, setResults] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [relatedIds, setRelatedIds] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew || !routeId) return;
    let cancelled = false;
    setLoading(true);
    fetchProject(routeId)
      .then((item) => {
        if (cancelled) return;
        fillForm(item);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Could not load project.',
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

  const fillForm = (item: ProjectContent) => {
    setProjectId(item.id);
    setTitle(item.title ?? '');
    const cat = item.category ?? '';
    if (
      PROJECT_CATEGORY_OPTIONS.includes(
        cat as (typeof PROJECT_CATEGORY_OPTIONS)[number],
      )
    ) {
      setCategory(cat);
      setCategoryCustom('');
    } else if (cat) {
      setCategory('Other');
      setCategoryCustom(cat);
    } else {
      setCategory(PROJECT_CATEGORY_OPTIONS[0]);
      setCategoryCustom('');
    }
    setClientType(item.clientType ?? '');
    const timelineValue = item.timeline ?? '';
    if (
      PROJECT_TIMELINE_OPTIONS.includes(
        timelineValue as (typeof PROJECT_TIMELINE_OPTIONS)[number],
      ) &&
      timelineValue !== 'Custom'
    ) {
      setTimelinePreset(timelineValue);
      setTimelineCustom('');
    } else if (timelineValue) {
      setTimelinePreset('Custom');
      setTimelineCustom(timelineValue);
    } else {
      setTimelinePreset(PROJECT_TIMELINE_OPTIONS[4]);
      setTimelineCustom('');
    }
    const statusValue = item.status ?? '';
    if (
      PROJECT_STATUS_OPTIONS.includes(
        statusValue as (typeof PROJECT_STATUS_OPTIONS)[number],
      )
    ) {
      setStatus(statusValue);
      setStatusCustom('');
    } else if (statusValue) {
      setStatus('Other');
      setStatusCustom(statusValue);
    } else {
      setStatus(PROJECT_STATUS_OPTIONS[0]);
      setStatusCustom('');
    }
    setOverview(item.overview ?? '');
    setProblem(item.problem ?? '');
    setSolution(item.solution ?? '');
    setTechnologies(listToParagraph(item.technologies));
    setFeatures(listToParagraph(item.features));
    setDeliverables(listToParagraph(item.deliverables));
    setResults(listToParagraph(item.results));
    setScreenshots((item.screenshots ?? []).filter(isUploadedImageUrl));
    setRelatedIds(listToParagraph(item.relatedIds));
    setCoverImage(isCustomCoverImage(item.image) ? (item.image ?? '') : '');
    setPublished(item.published !== false);
  };

  const resolvedCategory =
    category === 'Other' ? categoryCustom.trim() : category;
  const resolvedTimeline =
    timelinePreset === 'Custom' ? timelineCustom.trim() : timelinePreset;
  const resolvedStatus = status === 'Other' ? statusCustom.trim() : status;

  const onSave = async () => {
    if (!isNew && !projectId.trim()) {
      alert.show({
        title: 'ID required',
        message: 'Project ID is missing.',
        severity: 'warning',
      });
      return;
    }
    if (!title.trim() || !overview.trim()) {
      alert.show({
        title: 'Missing fields',
        message: 'Title and overview are required.',
        severity: 'warning',
      });
      return;
    }
    if (!resolvedCategory) {
      alert.show({
        title: 'Category required',
        message: 'Select a category or enter a custom one.',
        severity: 'warning',
      });
      return;
    }
    if (!resolvedStatus) {
      alert.show({
        title: 'Status required',
        message: 'Select a status or enter a custom one.',
        severity: 'warning',
      });
      return;
    }
    if (!resolvedTimeline) {
      alert.show({
        title: 'Timeline required',
        message: 'Select a timeline or enter a custom value.',
        severity: 'warning',
      });
      return;
    }
    if (!clientType.trim() || !problem.trim() || !solution.trim()) {
      alert.show({
        title: 'Missing fields',
        message: 'Client type, problem, and solution are required.',
        severity: 'warning',
      });
      return;
    }

    const techList = paragraphToList(technologies);
    const featureList = paragraphToList(features);
    const deliverableList = paragraphToList(deliverables);
    const resultList = paragraphToList(results);
    if (
      !techList.length ||
      !featureList.length ||
      !deliverableList.length ||
      !resultList.length
    ) {
      alert.show({
        title: 'Lists required',
        message:
          'Technologies, features, deliverables, and results each need at least one line.',
        severity: 'warning',
      });
      return;
    }

    const payload: ProjectContent = {
      id: isNew ? 'auto' : projectId,
      title: title.trim(),
      category: resolvedCategory,
      clientType: clientType.trim(),
      timeline: resolvedTimeline,
      status: resolvedStatus,
      overview: overview.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      technologies: techList,
      features: featureList,
      deliverables: deliverableList,
      results: resultList,
      screenshots,
      relatedIds: paragraphToList(relatedIds),
      image: coverImage,
      published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createProject(payload);
        setProjectId(created.id);
        alert.show({
          title: 'Project posted',
          message: `Project created with ID ${created.id}.`,
          severity: 'success',
        });
      } else {
        await updateProject(routeId!, payload);
        alert.show({
          title: 'Saved',
          message: 'Project updated successfully.',
          severity: 'success',
        });
      }
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save project.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const onPickScreenshots = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;

    setUploading(true);
    try {
      const urls = await uploadProjectScreenshots(files);
      setScreenshots((prev) => [...prev, ...urls]);
    } catch (err) {
      alert.show({
        title: 'Upload failed',
        message:
          err instanceof Error ? err.message : 'Could not upload screenshots.',
        severity: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (loadError) {
    return (
      <Stack spacing={2}>
        <Typography color="error">{loadError}</Typography>
        <Button component={RouterLink} to={ROUTES.adminProjects} variant="outlined">
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
          {isNew ? 'Post project' : `Edit ${title || routeId}`}
        </Typography>
        <Button component={RouterLink} to={ROUTES.adminProjects} variant="outlined">
          Cancel
        </Button>
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
        Required fields
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Project ID"
        value={isNew ? 'Auto-generated on save (QDLPJ-0001, …)' : projectId}
        disabled
        fullWidth
        helperText={
          isNew
            ? 'Server assigns the next ID: QDLPJ-0001, QDLPJ-0002, …'
            : 'Business project ID (cannot be changed).'
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            fullWidth
            required
          >
            {PROJECT_CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {category === 'Other' ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Custom category"
              value={categoryCustom}
              onChange={(event) => setCategoryCustom(event.target.value)}
              fullWidth
              required
            />
          </Grid>
        ) : null}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Client type"
            value={clientType}
            onChange={(event) => setClientType(event.target.value)}
            fullWidth
            required
            placeholder="e.g. Corporate / Services company"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Timeline"
            value={timelinePreset}
            onChange={(event) => setTimelinePreset(event.target.value)}
            fullWidth
            required
          >
            {PROJECT_TIMELINE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {timelinePreset === 'Custom' ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Custom timeline"
              value={timelineCustom}
              onChange={(event) => setTimelineCustom(event.target.value)}
              fullWidth
              required
              placeholder="e.g. 14–18 weeks"
            />
          </Grid>
        ) : null}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            fullWidth
            required
          >
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {status === 'Other' ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Custom status"
              value={statusCustom}
              onChange={(event) => setStatusCustom(event.target.value)}
              fullWidth
              required
            />
          </Grid>
        ) : null}
      </Grid>

      <TextField
        label="Overview"
        value={overview}
        onChange={(event) => setOverview(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Problem"
        value={problem}
        onChange={(event) => setProblem(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Solution"
        value={solution}
        onChange={(event) => setSolution(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Technologies"
        value={technologies}
        onChange={(event) => setTechnologies(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="One technology per line."
      />
      <TextField
        label="Features"
        value={features}
        onChange={(event) => setFeatures(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="One feature per line."
      />
      <TextField
        label="Deliverables"
        value={deliverables}
        onChange={(event) => setDeliverables(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="One deliverable per line."
      />
      <TextField
        label="Results"
        value={results}
        onChange={(event) => setResults(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="One result per line."
      />

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, pt: 1 }}>
        Optional extras
      </Typography>

      <CoverImageField
        value={coverImage}
        onChange={setCoverImage}
        onError={(message) =>
          alert.show({ title: 'Upload failed', message, severity: 'error' })
        }
        disabled={saving || uploading}
      />

      <Stack spacing={1.5}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Screenshots
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Upload multiple images (JPG, PNG, WEBP, GIF). If none are added, a default
          project image is used automatically.
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(event) => void onPickScreenshots(event)}
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || saving}
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {uploading ? 'Uploading…' : 'Upload screenshots'}
        </Button>
        {screenshots.length > 0 ? (
          <Grid container spacing={1.5}>
            {screenshots.map((url, index) => (
              <Grid key={`${url}-${index}`} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={resolveMediaUrl(url)}
                    alt={`Screenshot ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'block',
                    }}
                  />
                  <IconButton
                    size="small"
                    aria-label={`Remove screenshot ${index + 1}`}
                    onClick={() => removeScreenshot(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    ×
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No screenshots yet — default image will be used on save.
          </Typography>
        )}
      </Stack>

      <TextField
        label="Related project IDs"
        value={relatedIds}
        onChange={(event) => setRelatedIds(event.target.value)}
        multiline
        minRows={2}
        fullWidth
        helperText="Optional. One existing project ID per line (e.g. QDLPJ-0001)."
      />

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
        {saving ? 'Saving…' : isNew ? 'Post project' : 'Save changes'}
      </Button>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => {
          alert.close();
          if (alert.severity === 'success') {
            navigate(ROUTES.adminProjects);
          }
        }}
      />
    </Stack>
  );
}
