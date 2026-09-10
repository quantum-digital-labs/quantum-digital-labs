import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AlertDialog, ConfirmDialog } from '../../components';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  contentApiByKind,
  type ContentKind,
  type ContentRecord,
} from '../../services';

interface AdminContentListPageProps {
  kind: ContentKind;
  title?: string;
  subtitle?: string;
  createLabel?: string;
}

function recordId(item: ContentRecord, idField: 'id' | 'slug'): string {
  if (idField === 'slug') {
    return String(item.slug ?? item.id ?? '');
  }
  return String(item.id ?? item.slug ?? '');
}

function recordTitle(item: ContentRecord): string {
  return String(item.title ?? item.role ?? item.id ?? item.slug ?? 'Untitled');
}

export function AdminContentListPage({
  kind,
  title,
  subtitle,
  createLabel,
}: AdminContentListPageProps) {
  const api = contentApiByKind[kind];
  const alert = useAlertPopup();
  const [items, setItems] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await api.list()) as unknown as ContentRecord[];
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load content.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.remove(deleteId);
      setDeleteId(null);
      await load();
      alert.show({
        title: 'Deleted',
        message: 'The item was removed.',
        severity: 'success',
      });
    } catch (err) {
      alert.show({
        title: 'Delete failed',
        message: err instanceof Error ? err.message : 'Could not delete item.',
        severity: 'error',
      });
    } finally {
      setDeleting(false);
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
            {title ?? api.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle ??
              `Create, edit, publish, or delete ${api.label.toLowerCase()} content.`}
          </Typography>
        </Stack>
        <Button
          component={RouterLink}
          to={`${api.basePath}/new`}
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{ fontWeight: 700, alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          {createLabel ?? 'New item'}
        </Button>
      </Stack>

      {loading ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" sx={emptySx}>
          No items yet. Create the first one.
        </Typography>
      ) : (
        <Table size="small" sx={tableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Published</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const id = recordId(item, api.idField);
              return (
                <TableRow key={id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{recordTitle(item)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={item.published === false ? 'Draft' : 'Published'}
                      color={item.published === false ? 'default' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={RouterLink}
                      to={`${api.basePath}/${encodeURIComponent(id)}`}
                      aria-label={`Edit ${id}`}
                      size="small"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label={`Delete ${id}`}
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(id)}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete item?"
        message={`This permanently removes “${deleteId}”. This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        confirmColor="error"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteId(null)}
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

const tableSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
  overflow: 'hidden',
  '& th': { fontWeight: 700, bgcolor: 'action.hover' },
} as const;

const emptySx = {
  p: 3,
  border: '1px dashed',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
} as const;
