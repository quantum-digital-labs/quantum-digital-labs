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
  PORTFOLIO_CATEGORY_OPTIONS,
  PORTFOLIO_INDUSTRY_OPTIONS,
  PORTFOLIO_TIMELINE_OPTIONS,
  listToParagraph,
  metricsToParagraph,
  paragraphToList,
  paragraphToMetrics,
} from '../../constants/portfolioCatalog';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  createPortfolioItem,
  fetchPortfolioItem,
  isCustomCoverImage,
  isUploadedImageUrl,
  resolveMediaUrl,
  updatePortfolioItem,
  uploadPortfolioGallery,
  type PortfolioContent,
} from '../../services';
import { AdminContentListPage } from './AdminContentListPage';

export function AdminPortfolioList() {
  return (
    <AdminContentListPage
      kind="portfolio"
      title="Portfolio"
      subtitle="Post case studies. They appear on the public Portfolio pages when published."
      createLabel="Post portfolio"
    />
  );
}

export function AdminPortfolioEditor() {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === 'new';
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [portfolioId, setPortfolioId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(PORTFOLIO_CATEGORY_OPTIONS[0]);
  const [categoryCustom, setCategoryCustom] = useState('');
  const [industry, setIndustry] = useState<string>(PORTFOLIO_INDUSTRY_OPTIONS[0]);
  const [industryCustom, setIndustryCustom] = useState('');
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [role, setRole] = useState('');
  const [timelinePreset, setTimelinePreset] = useState<string>(
    PORTFOLIO_TIMELINE_OPTIONS[4],
  );
  const [timelineCustom, setTimelineCustom] = useState('');
  const [overview, setOverview] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [challenge, setChallenge] = useState('');
  const [strategy, setStrategy] = useState('');
  const [development, setDevelopment] = useState('');
  const [technologyNarrative, setTechnologyNarrative] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [features, setFeatures] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [results, setResults] = useState('');
  const [caseResults, setCaseResults] = useState('');
  const [metrics, setMetrics] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [relatedIds, setRelatedIds] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew || !routeId) return;
    let cancelled = false;
    setLoading(true);
    fetchPortfolioItem(routeId)
      .then((item) => {
        if (cancelled) return;
        fillForm(item);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Could not load portfolio item.',
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

  const fillForm = (item: PortfolioContent) => {
    setPortfolioId(item.id);
    setTitle(item.title ?? '');
    const cat = item.category ?? '';
    if (
      PORTFOLIO_CATEGORY_OPTIONS.includes(
        cat as (typeof PORTFOLIO_CATEGORY_OPTIONS)[number],
      )
    ) {
      setCategory(cat);
      setCategoryCustom('');
    } else if (cat) {
      setCategory('Other');
      setCategoryCustom(cat);
    } else {
      setCategory(PORTFOLIO_CATEGORY_OPTIONS[0]);
      setCategoryCustom('');
    }
    const ind = item.industry ?? '';
    if (
      PORTFOLIO_INDUSTRY_OPTIONS.includes(
        ind as (typeof PORTFOLIO_INDUSTRY_OPTIONS)[number],
      ) &&
      ind !== 'Other'
    ) {
      setIndustry(ind);
      setIndustryCustom('');
    } else if (ind) {
      setIndustry('Other');
      setIndustryCustom(ind);
    } else {
      setIndustry(PORTFOLIO_INDUSTRY_OPTIONS[0]);
      setIndustryCustom('');
    }
    setYear((item.year ?? '').replace(/\D/g, '').slice(0, 4));
    setRole(item.role ?? '');
    const timelineValue = item.timeline ?? '';
    if (
      PORTFOLIO_TIMELINE_OPTIONS.includes(
        timelineValue as (typeof PORTFOLIO_TIMELINE_OPTIONS)[number],
      ) &&
      timelineValue !== 'Custom'
    ) {
      setTimelinePreset(timelineValue);
      setTimelineCustom('');
    } else if (timelineValue) {
      setTimelinePreset('Custom');
      setTimelineCustom(timelineValue);
    } else {
      setTimelinePreset(PORTFOLIO_TIMELINE_OPTIONS[4]);
      setTimelineCustom('');
    }
    setOverview(item.overview ?? '');
    setProblem(item.problem ?? '');
    setSolution(item.solution ?? '');
    setChallenge(item.challenge ?? '');
    setStrategy(item.strategy ?? '');
    setDevelopment(item.development ?? '');
    setTechnologyNarrative(item.technologyNarrative ?? '');
    setTechnologies(listToParagraph(item.technologies));
    setFeatures(listToParagraph(item.features));
    setDeliverables(listToParagraph(item.deliverables));
    setResults(listToParagraph(item.results));
    setCaseResults(listToParagraph(item.caseResults));
    setMetrics(metricsToParagraph(item.metrics));
    setGalleryImages(
      (item.galleryLabels ?? []).filter(
        (url) =>
          isUploadedImageUrl(url) && !url.includes('/uploads/defaults/'),
      ),
    );
    setRelatedIds(listToParagraph(item.relatedIds));
    setCoverImage(isCustomCoverImage(item.image) ? (item.image ?? '') : '');
    setPublished(item.published !== false);
  };

  const resolvedCategory =
    category === 'Other' ? categoryCustom.trim() : category;
  const resolvedIndustry =
    industry === 'Other' ? industryCustom.trim() : industry;
  const resolvedTimeline =
    timelinePreset === 'Custom' ? timelineCustom.trim() : timelinePreset;

  const onSave = async () => {
    if (!isNew && !portfolioId.trim()) {
      alert.show({
        title: 'ID required',
        message: 'Portfolio ID is missing.',
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
    if (!resolvedIndustry) {
      alert.show({
        title: 'Industry required',
        message: 'Select an industry or enter a custom one.',
        severity: 'warning',
      });
      return;
    }
    if (!/^\d{4}$/.test(year.trim())) {
      alert.show({
        title: 'Invalid year',
        message: 'Year must be a 4-digit number (e.g. 2026).',
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
    if (
      !role.trim() ||
      !problem.trim() ||
      !solution.trim() ||
      !challenge.trim() ||
      !strategy.trim() ||
      !development.trim() ||
      !technologyNarrative.trim()
    ) {
      alert.show({
        title: 'Missing fields',
        message:
          'Role, problem, solution, challenge, strategy, development, and technology narrative are required.',
        severity: 'warning',
      });
      return;
    }

    const techList = paragraphToList(technologies);
    const featureList = paragraphToList(features);
    const deliverableList = paragraphToList(deliverables);
    const resultList = paragraphToList(results);
    const caseResultList = paragraphToList(caseResults);
    if (
      !techList.length ||
      !featureList.length ||
      !deliverableList.length ||
      !resultList.length ||
      !caseResultList.length
    ) {
      alert.show({
        title: 'Lists required',
        message:
          'Technologies, features, deliverables, results, and case results each need at least one line.',
        severity: 'warning',
      });
      return;
    }

    const metricList = paragraphToMetrics(metrics);
    const relatedList = paragraphToList(relatedIds);

    const payload: PortfolioContent = {
      id: isNew ? 'auto' : portfolioId,
      title: title.trim(),
      category: resolvedCategory,
      industry: resolvedIndustry,
      year: year.trim(),
      role: role.trim(),
      timeline: resolvedTimeline,
      overview: overview.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      challenge: challenge.trim(),
      strategy: strategy.trim(),
      development: development.trim(),
      technologyNarrative: technologyNarrative.trim(),
      technologies: techList,
      features: featureList,
      deliverables: deliverableList,
      results: resultList,
      caseResults: caseResultList,
      metrics: metricList,
      galleryLabels: galleryImages,
      relatedIds: relatedList,
      image: coverImage,
      published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createPortfolioItem(payload);
        setPortfolioId(created.id);
        alert.show({
          title: 'Portfolio posted',
          message: `Case study created with ID ${created.id}.`,
          severity: 'success',
        });
      } else {
        await updatePortfolioItem(routeId!, payload);
        alert.show({
          title: 'Saved',
          message: 'Portfolio updated successfully.',
          severity: 'success',
        });
      }
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message:
          err instanceof Error ? err.message : 'Could not save portfolio item.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const onPickGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;

    setUploading(true);
    try {
      const urls = await uploadPortfolioGallery(files);
      setGalleryImages((prev) => [...prev, ...urls]);
    } catch (err) {
      alert.show({
        title: 'Upload failed',
        message:
          err instanceof Error ? err.message : 'Could not upload gallery images.',
        severity: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (loadError) {
    return (
      <Stack spacing={2}>
        <Typography color="error">{loadError}</Typography>
        <Button component={RouterLink} to={ROUTES.adminPortfolio} variant="outlined">
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
          {isNew ? 'Post portfolio' : `Edit ${title || routeId}`}
        </Typography>
        <Button component={RouterLink} to={ROUTES.adminPortfolio} variant="outlined">
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
        label="Portfolio ID"
        value={isNew ? 'Auto-generated on save (QDLPF-0001, …)' : portfolioId}
        disabled
        fullWidth
        helperText={
          isNew
            ? 'Server assigns the next ID: QDLPF-0001, QDLPF-0002, …'
            : 'Business portfolio ID (cannot be changed).'
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
            {PORTFOLIO_CATEGORY_OPTIONS.map((option) => (
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
            select
            label="Industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            fullWidth
            required
          >
            {PORTFOLIO_INDUSTRY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {industry === 'Other' ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Custom industry"
              value={industryCustom}
              onChange={(event) => setIndustryCustom(event.target.value)}
              fullWidth
              required
            />
          </Grid>
        ) : null}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Year"
            value={year}
            onChange={(event) =>
              setYear(event.target.value.replace(/\D/g, '').slice(0, 4))
            }
            fullWidth
            required
            inputProps={{
              inputMode: 'numeric',
              pattern: '\\d{4}',
              maxLength: 4,
            }}
            helperText="4-digit year only (e.g. 2026)."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Our role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            fullWidth
            required
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
            {PORTFOLIO_TIMELINE_OPTIONS.map((option) => (
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
        label="Challenge"
        value={challenge}
        onChange={(event) => setChallenge(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Strategy"
        value={strategy}
        onChange={(event) => setStrategy(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Development"
        value={development}
        onChange={(event) => setDevelopment(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Technology narrative"
        value={technologyNarrative}
        onChange={(event) => setTechnologyNarrative(event.target.value)}
        required
        multiline
        minRows={2}
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
      <TextField
        label="Case results"
        value={caseResults}
        onChange={(event) => setCaseResults(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="One case-study result per line."
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

      <TextField
        label="Metrics"
        value={metrics}
        onChange={(event) => setMetrics(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        helperText="Optional. One per line as Label | Value (e.g. Primary journeys | 3 mapped)."
      />

      <Stack spacing={1.5}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Gallery images
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Upload multiple images (JPG, PNG, WEBP, GIF). If none are added, default
          gallery images are used automatically.
        </Typography>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(event) => void onPickGallery(event)}
        />
        <Button
          variant="outlined"
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploading || saving}
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {uploading ? 'Uploading…' : 'Upload gallery images'}
        </Button>
        {galleryImages.length > 0 ? (
          <Grid container spacing={1.5}>
            {galleryImages.map((url, index) => (
              <Grid key={`${url}-${index}`} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={resolveMediaUrl(url)}
                    alt={`Gallery ${index + 1}`}
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
                    aria-label={`Remove gallery image ${index + 1}`}
                    onClick={() => removeGalleryImage(index)}
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
            No gallery images yet — defaults will be used on save.
          </Typography>
        )}
      </Stack>

      <TextField
        label="Related portfolio IDs"
        value={relatedIds}
        onChange={(event) => setRelatedIds(event.target.value)}
        multiline
        minRows={2}
        fullWidth
        helperText="Optional. One existing portfolio ID per line."
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
        {saving ? 'Saving…' : isNew ? 'Post portfolio' : 'Save changes'}
      </Button>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => {
          alert.close();
          if (alert.severity === 'success') {
            navigate(ROUTES.adminPortfolio);
          }
        }}
      />
    </Stack>
  );
}
