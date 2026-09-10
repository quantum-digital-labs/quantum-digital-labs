import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { AlertDialog } from '../../components';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  contentApiByKind,
  type ContentKind,
  type ContentRecord,
} from '../../services';

interface AdminContentEditorPageProps {
  kind: ContentKind;
}

function stripMeta(record: ContentRecord): ContentRecord {
  const { id: _id, slug: _slug, title: _title, published: _published, ...rest } = record;
  return rest;
}

export function AdminContentEditorPage({ kind }: AdminContentEditorPageProps) {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === 'new';
  const api = contentApiByKind[kind];
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [itemId, setItemId] = useState('');
  const [title, setTitle] = useState('');
  const [published, setPublished] = useState(true);
  const [dataJson, setDataJson] = useState('{\n  \n}');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const autoBusinessId = kind === 'internships';
  const idFieldLabel = api.idField === 'slug' ? 'Slug' : 'ID';

  useEffect(() => {
    if (isNew || !routeId) return;
    let cancelled = false;
    setLoading(true);
    api
      .get(routeId)
      .then((item) => {
        if (cancelled) return;
        const record = item as unknown as ContentRecord;
        const idValue =
          api.idField === 'slug'
            ? String(record.slug ?? record.id ?? routeId)
            : String(record.id ?? record.slug ?? routeId);
        setItemId(idValue);
        setTitle(String(record.title ?? record.role ?? ''));
        setPublished(record.published !== false);
        setDataJson(JSON.stringify(stripMeta(record), null, 2));
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Could not load item.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, isNew, routeId]);

  const parsedHint = useMemo(() => {
    try {
      JSON.parse(dataJson);
      return null;
    } catch {
      return 'JSON is invalid';
    }
  }, [dataJson]);

  const onSave = async () => {
    const id = itemId.trim();
    if (!autoBusinessId && !id) {
      alert.show({
        title: `${idFieldLabel} required`,
        message: `Enter a stable ${idFieldLabel.toLowerCase()} before saving.`,
        severity: 'warning',
      });
      return;
    }
    if (!title.trim()) {
      alert.show({
        title: 'Title required',
        message: 'Enter a title for this content item.',
        severity: 'warning',
      });
      return;
    }

    let data: ContentRecord;
    try {
      const parsed = JSON.parse(dataJson) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Data must be a JSON object');
      }
      data = parsed as ContentRecord;
    } catch (err) {
      alert.show({
        title: 'Invalid JSON',
        message: err instanceof Error ? err.message : 'Fix the data JSON before saving.',
        severity: 'error',
      });
      return;
    }

    const body: ContentRecord = {
      ...data,
      ...(api.idField === 'slug'
        ? { slug: id }
        : { id: id || 'auto' }),
      title: title.trim(),
      published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = (await api.create(body)) as unknown as ContentRecord;
        if (autoBusinessId && created.id) {
          setItemId(String(created.id));
        }
        alert.show({
          title: 'Saved',
          message: autoBusinessId
            ? `Created with ID ${String(created.id ?? '')}.`
            : `${api.label.slice(0, -1) || 'Item'} saved successfully.`,
          severity: 'success',
        });
      } else {
        await api.update(routeId!, body);
        alert.show({
          title: 'Saved',
          message: `${api.label.slice(0, -1) || 'Item'} saved successfully.`,
          severity: 'success',
        });
      }
      navigate(api.basePath);
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save item.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography color="text.secondary">Loading…</Typography>;
  }

  if (loadError) {
    return (
      <Stack spacing={2}>
        <Typography color="error">{loadError}</Typography>
        <Button component={RouterLink} to={api.basePath} variant="outlined">
          Back to list
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Stack spacing={0.5}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
            {isNew ? `New ${api.label.slice(0, -1) || 'item'}` : `Edit ${title || itemId}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit core fields, then the full content payload as JSON.
          </Typography>
        </Stack>
        <Button component={RouterLink} to={api.basePath} variant="outlined">
          Cancel
        </Button>
      </Stack>

      <TextField
        label={idFieldLabel}
        value={
          isNew && autoBusinessId
            ? 'Auto-generated on save (QDLIN-0001, …)'
            : itemId
        }
        onChange={(event) => setItemId(event.target.value)}
        disabled={!isNew || autoBusinessId}
        helperText={
          autoBusinessId
            ? isNew
              ? 'Server assigns the next ID: QDLIN-0001, QDLIN-0002, …'
              : 'Business ID (cannot be changed).'
            : isNew
              ? `Stable ${idFieldLabel.toLowerCase()} used in URLs (cannot change later).`
              : `Locked ${idFieldLabel.toLowerCase()}`
        }
        fullWidth
      />
      <TextField
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
        }
        label="Published"
      />
      <TextField
        label="Data (JSON)"
        value={dataJson}
        onChange={(event) => setDataJson(event.target.value)}
        multiline
        minRows={16}
        fullWidth
        error={Boolean(parsedHint)}
        helperText={parsedHint ?? 'Full content object excluding id/title/published.'}
        slotProps={{
          input: {
            sx: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.85rem',
            },
          },
        }}
      />

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          onClick={() => void onSave()}
          disabled={saving}
          sx={{ fontWeight: 700 }}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button component={RouterLink} to={api.basePath} variant="text">
          Back
        </Button>
      </Stack>

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
