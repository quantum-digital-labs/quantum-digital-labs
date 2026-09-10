import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { AlertDialog } from '../../components';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import { fetchAbout, updateAbout, type AboutContent } from '../../services';

export function AdminAboutPage() {
  const alert = useAlertPopup();
  const [json, setJson] = useState('{\n  \n}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAbout()
      .then((data) => {
        if (!cancelled) {
          setJson(JSON.stringify(data, null, 2));
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load about content.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async () => {
    let parsed: AboutContent;
    try {
      parsed = JSON.parse(json) as AboutContent;
    } catch {
      alert.show({
        title: 'Invalid JSON',
        message: 'Fix the about JSON before saving.',
        severity: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      const saved = await updateAbout(parsed);
      setJson(JSON.stringify(saved, null, 2));
      alert.show({
        title: 'Saved',
        message: 'About content updated.',
        severity: 'success',
      });
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save about content.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography color="text.secondary">Loading…</Typography>;
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Edit vision, mission, journey, values, and related about-page fields as JSON.
        </Typography>
      </Stack>

      {error ? <Typography color="error">{error}</Typography> : null}

      <TextField
        label="About data (JSON)"
        value={json}
        onChange={(event) => setJson(event.target.value)}
        multiline
        minRows={20}
        fullWidth
        slotProps={{
          input: {
            sx: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.85rem',
            },
          },
        }}
      />

      <Button
        variant="contained"
        onClick={() => void onSave()}
        disabled={saving}
        sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
      >
        {saving ? 'Saving…' : 'Save'}
      </Button>

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
