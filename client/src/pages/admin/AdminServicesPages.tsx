import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { AlertDialog, ConfirmDialog } from '../../components';
import { CoverImageField } from '../../components/admin/CoverImageField';
import {
  faqsToParagraph,
  getCategoryLabel,
  listToParagraph,
  paragraphToFaqs,
  paragraphToList,
  SERVICE_CATEGORY_OPTIONS,
  SERVICE_SUBCATEGORIES,
} from '../../constants/serviceCatalog';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import type { ServiceCategoryId } from '../../types/content';
import {
  createService,
  createServiceCategory,
  deleteService,
  fetchService,
  fetchServiceCategory,
  fetchServices,
  isCustomCoverImage,
  updateService,
  type ServiceCategoryContent,
  type ServiceItemContent,
} from '../../services';

interface FlatServiceRow {
  categoryId: string;
  categoryTitle: string;
  slug: string;
  title: string;
  published: boolean;
}

async function ensureCategoryExists(categoryId: ServiceCategoryId): Promise<void> {
  const option = SERVICE_CATEGORY_OPTIONS.find((item) => item.id === categoryId);
  if (!option) {
    throw new Error('Invalid service category');
  }

  try {
    await fetchServiceCategory(categoryId);
  } catch {
    await createServiceCategory({
      id: option.id,
      title: option.label,
      path: option.path,
      description: `${option.label} offered by Quantum Digital Labs.`,
      published: true,
      sort_order: SERVICE_CATEGORY_OPTIONS.findIndex((item) => item.id === categoryId),
      services: [],
    });
  }
}

export function AdminServicesListPage() {
  const alert = useAlertPopup();
  const [rows, setRows] = useState<FlatServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FlatServiceRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const categories = await fetchServices({ includeUnpublished: true });
      const flat: FlatServiceRow[] = [];
      for (const category of categories) {
        for (const service of category.services ?? []) {
          flat.push({
            categoryId: category.id,
            categoryTitle: category.title,
            slug: service.slug,
            title: service.title,
            published: (service as ServiceItemContent).published !== false,
          });
        }
      }
      setRows(flat);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget.categoryId, deleteTarget.slug);
      setDeleteTarget(null);
      await load();
      alert.show({
        title: 'Deleted',
        message: 'Service removed from the public site.',
        severity: 'success',
      });
    } catch (err) {
      alert.show({
        title: 'Delete failed',
        message: err instanceof Error ? err.message : 'Could not delete service.',
        severity: 'error',
      });
    }
  };

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Stack spacing={0.5}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
            Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create services with category and sub-category. They appear on the public
            website after save.
          </Typography>
        </Stack>
        <Button
          component={RouterLink}
          to={`${ROUTES.adminServices}/new`}
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{ fontWeight: 700 }}
        >
          New service
        </Button>
      </Stack>

      {loading ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary">No services yet. Create one to get started.</Typography>
      ) : (
        <Table size="small" sx={tableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Sub-category</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Published</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.categoryId}:${row.slug}`} hover>
                <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                <TableCell>{row.categoryTitle || getCategoryLabel(row.categoryId)}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {row.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.published ? 'Published' : 'Draft'}
                    color={row.published ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    component={RouterLink}
                    to={`${ROUTES.adminServices}/${encodeURIComponent(row.categoryId)}/${encodeURIComponent(row.slug)}`}
                    size="small"
                    aria-label={`Edit ${row.title}`}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label={`Delete ${row.title}`}
                    onClick={() => setDeleteTarget(row)}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete service?"
        message={
          deleteTarget
            ? `This permanently removes “${deleteTarget.title}” from ${deleteTarget.categoryTitle}.`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={alert.close}
      />
    </Stack>
  );
}

export function AdminServiceEditorPage() {
  const { categoryId: routeCategoryId, slug: routeSlug } = useParams();
  const isNew = !routeCategoryId || routeCategoryId === 'new' || !routeSlug;
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [categoryId, setCategoryId] = useState<ServiceCategoryId>('it');
  const [subcategorySlug, setSubcategorySlug] = useState(
    SERVICE_SUBCATEGORIES.it[0]?.slug ?? '',
  );
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [whatYouGet, setWhatYouGet] = useState('');
  const [features, setFeatures] = useState('');
  const [processText, setProcessText] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [faqText, setFaqText] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const subcategoryOptions = useMemo(
    () => SERVICE_SUBCATEGORIES[categoryId] ?? [],
    [categoryId],
  );

  const selectedSubcategory = useMemo(
    () => subcategoryOptions.find((item) => item.slug === subcategorySlug),
    [subcategoryOptions, subcategorySlug],
  );

  useEffect(() => {
    if (!subcategoryOptions.some((item) => item.slug === subcategorySlug)) {
      setSubcategorySlug(subcategoryOptions[0]?.slug ?? '');
    }
  }, [subcategoryOptions, subcategorySlug]);

  useEffect(() => {
    if (isNew || !routeCategoryId || !routeSlug) return;
    let cancelled = false;
    setLoading(true);
    fetchService(routeCategoryId, routeSlug)
      .then((service) => {
        if (cancelled) return;
        const catId = (routeCategoryId in SERVICE_SUBCATEGORIES
          ? routeCategoryId
          : 'it') as ServiceCategoryId;
        setCategoryId(catId);
        setSubcategorySlug(service.slug);
        setDescription(service.description ?? '');
        setTechStack(listToParagraph(service.technologies));
        setWhatYouGet(listToParagraph(service.benefits));
        setFeatures(listToParagraph(service.features));
        setProcessText(listToParagraph(service.process));
        setDeliverables(listToParagraph(service.deliverables));
        setFaqText(faqsToParagraph(service.faqs));
        setCoverImage(
          isCustomCoverImage(service.image) ? (service.image ?? '') : '',
        );
        setPublished(service.published !== false);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Could not load service.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isNew, routeCategoryId, routeSlug]);

  const onSave = async () => {
    if (!selectedSubcategory) {
      alert.show({
        title: 'Sub-category required',
        message: 'Select a sub-category for this service.',
        severity: 'warning',
      });
      return;
    }

    if (!description.trim()) {
      alert.show({
        title: 'Description required',
        message: 'Enter a short description for the public service page.',
        severity: 'warning',
      });
      return;
    }

    const payload = {
      slug: selectedSubcategory.slug,
      title: selectedSubcategory.title,
      shortDescription: description.trim().slice(0, 160),
      description: description.trim(),
      technologies: paragraphToList(techStack),
      benefits: paragraphToList(whatYouGet),
      features: paragraphToList(features),
      process: paragraphToList(processText),
      deliverables: paragraphToList(deliverables),
      faqs: paragraphToFaqs(faqText),
      image: coverImage,
      published,
    };

    setSaving(true);
    try {
      await ensureCategoryExists(categoryId);
      if (isNew) {
        await createService(categoryId, payload);
      } else if (routeCategoryId && routeSlug) {
        if (routeCategoryId !== categoryId || routeSlug !== selectedSubcategory.slug) {
          await createService(categoryId, payload);
          await deleteService(routeCategoryId, routeSlug);
        } else {
          await updateService(categoryId, routeSlug, payload);
        }
      }
      alert.show({
        title: 'Saved',
        message: 'Service saved and available on the public website.',
        severity: 'success',
      });
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save service.',
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
        <Button component={RouterLink} to={ROUTES.adminServices} variant="outlined">
          Back
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 820 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
          {isNew ? 'New service' : `Edit ${selectedSubcategory?.title ?? routeSlug}`}
        </Typography>
        <Button component={RouterLink} to={ROUTES.adminServices} variant="outlined">
          Cancel
        </Button>
      </Stack>

      <TextField
        select
        label="Category"
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value as ServiceCategoryId)}
        disabled={!isNew}
        fullWidth
        helperText={
          isNew
            ? 'Choose the main service category shown on the public site.'
            : 'Category is fixed when editing. Create a new service to change category.'
        }
      >
        {SERVICE_CATEGORY_OPTIONS.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sub-category"
        value={subcategorySlug}
        onChange={(event) => setSubcategorySlug(event.target.value)}
        disabled={!isNew}
        fullWidth
        helperText="Service type under the selected category."
      >
        {subcategoryOptions.map((option) => (
          <MenuItem key={option.slug} value={option.slug}>
            {option.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        helperText="Shown at the top of the public service page."
      />

      <CoverImageField
        value={coverImage}
        onChange={setCoverImage}
        onError={(message) =>
          alert.show({ title: 'Upload failed', message, severity: 'error' })
        }
        disabled={saving}
      />

      <TextField
        label="Tech stack"
        value={techStack}
        onChange={(event) => setTechStack(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        helperText="One item per line (e.g. React, Node.js)."
      />

      <TextField
        label="What you get"
        value={whatYouGet}
        onChange={(event) => setWhatYouGet(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        helperText="One benefit per line."
      />

      <TextField
        label="Features"
        value={features}
        onChange={(event) => setFeatures(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        helperText="One feature per line."
      />

      <TextField
        label="Process"
        value={processText}
        onChange={(event) => setProcessText(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        helperText="One process step per line."
      />

      <TextField
        label="Deliverables"
        value={deliverables}
        onChange={(event) => setDeliverables(event.target.value)}
        multiline
        minRows={3}
        fullWidth
        helperText="One deliverable per line."
      />

      <TextField
        label="FAQ"
        value={faqText}
        onChange={(event) => setFaqText(event.target.value)}
        multiline
        minRows={4}
        fullWidth
        helperText="One FAQ per line as: Question | Answer"
      />

      <FormControlLabel
        control={
          <Switch
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
        {saving ? 'Saving…' : 'Save service'}
      </Button>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => {
          alert.close();
          if (alert.severity === 'success') {
            navigate(ROUTES.adminServices);
          }
        }}
      />
    </Stack>
  );
}

/** Kept for older imports — prefer AdminServiceEditorPage */
export function AdminServiceCategoryEditorPage() {
  return <AdminServiceEditorPage />;
}

const tableSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
  overflow: 'hidden',
  '& th': { fontWeight: 700, bgcolor: 'action.hover' },
} as const;
