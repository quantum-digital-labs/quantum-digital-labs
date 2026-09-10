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
  BLOG_CATEGORY_OPTIONS,
  BLOG_READING_TIME_OPTIONS,
  listToParagraph,
  paragraphToList,
  slugifyBlogSlug,
} from '../../constants/blogCatalog';
import { ROUTES } from '../../constants';
import { useAlertPopup } from '../../hooks/useValidationPopup';
import {
  createBlogPost,
  fetchBlogPost,
  updateBlogPost,
  type BlogContent,
} from '../../services';
import { AdminContentListPage } from './AdminContentListPage';

export function AdminBlogList() {
  return (
    <AdminContentListPage
      kind="blog"
      title="Blog"
      subtitle="Post articles. They appear on the public Blog pages when published."
      createLabel="Post article"
    />
  );
}

export function AdminBlogEditor() {
  const { id: routeId } = useParams();
  const isNew = !routeId || routeId === 'new';
  const navigate = useNavigate();
  const alert = useAlertPopup();

  const [blogId, setBlogId] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Quantum Digital Labs Editorial');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<string>(BLOG_CATEGORY_OPTIONS[0]);
  const [categoryCustom, setCategoryCustom] = useState('');
  const [readingTimePreset, setReadingTimePreset] = useState<string>(
    BLOG_READING_TIME_OPTIONS[2],
  );
  const [readingTimeCustom, setReadingTimeCustom] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !routeId) return;
    let cancelled = false;
    setLoading(true);
    fetchBlogPost(routeId)
      .then((item) => {
        if (cancelled) return;
        fillForm(item);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Could not load blog post.',
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

  const fillForm = (item: BlogContent) => {
    setBlogId(item.id ?? '');
    setSlug(item.slug ?? '');
    setSlugTouched(true);
    setTitle(item.title ?? '');
    setAuthor(item.author ?? 'Quantum Digital Labs Editorial');
    setDate(toDateInputValue(item.date));
    const cat = item.category ?? '';
    if (
      BLOG_CATEGORY_OPTIONS.includes(cat as (typeof BLOG_CATEGORY_OPTIONS)[number]) &&
      cat !== 'Other'
    ) {
      setCategory(cat);
      setCategoryCustom('');
    } else if (cat) {
      setCategory('Other');
      setCategoryCustom(cat);
    } else {
      setCategory(BLOG_CATEGORY_OPTIONS[0]);
      setCategoryCustom('');
    }
    const reading = item.readingTime ?? '';
    if (
      BLOG_READING_TIME_OPTIONS.includes(
        reading as (typeof BLOG_READING_TIME_OPTIONS)[number],
      ) &&
      reading !== 'Custom'
    ) {
      setReadingTimePreset(reading);
      setReadingTimeCustom('');
    } else if (reading) {
      setReadingTimePreset('Custom');
      setReadingTimeCustom(reading);
    } else {
      setReadingTimePreset(BLOG_READING_TIME_OPTIONS[2]);
      setReadingTimeCustom('');
    }
    setExcerpt(item.excerpt ?? '');
    setTags(listToParagraph(item.tags));
    setContent(listToParagraph(item.content));
    setFeatured(item.featured === true);
    setPublished(item.published !== false);
  };

  const onTitleChange = (next: string) => {
    setTitle(next);
    if (isNew && !slugTouched) {
      setSlug(slugifyBlogSlug(next));
    }
  };

  const resolvedCategory =
    category === 'Other' ? categoryCustom.trim() : category;
  const resolvedReadingTime =
    readingTimePreset === 'Custom'
      ? readingTimeCustom.trim()
      : readingTimePreset;

  const onSave = async () => {
    const slugValue = slug.trim();
    if (!slugValue) {
      alert.show({
        title: 'Slug required',
        message: 'Enter a URL slug before saving.',
        severity: 'warning',
      });
      return;
    }
    if (!title.trim() || !excerpt.trim()) {
      alert.show({
        title: 'Missing fields',
        message: 'Title and excerpt are required.',
        severity: 'warning',
      });
      return;
    }
    if (!author.trim() || !date.trim()) {
      alert.show({
        title: 'Missing fields',
        message: 'Author and date are required.',
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
    if (!resolvedReadingTime) {
      alert.show({
        title: 'Reading time required',
        message: 'Select a reading time or enter a custom value.',
        severity: 'warning',
      });
      return;
    }

    const tagList = paragraphToList(tags);
    const contentList = paragraphToList(content);
    if (!tagList.length || !contentList.length) {
      alert.show({
        title: 'Lists required',
        message: 'Tags and content each need at least one line.',
        severity: 'warning',
      });
      return;
    }

    const payload: BlogContent = {
      ...(isNew ? {} : { id: blogId || undefined }),
      slug: slugValue,
      title: title.trim(),
      author: author.trim(),
      date: date.trim(),
      category: resolvedCategory,
      readingTime: resolvedReadingTime,
      excerpt: excerpt.trim(),
      tags: tagList,
      content: contentList,
      featured,
      published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createBlogPost(payload);
        setBlogId(created.id ?? '');
        alert.show({
          title: 'Article posted',
          message: `Article created with ID ${created.id ?? created.slug}.`,
          severity: 'success',
        });
      } else {
        await updateBlogPost(routeId!, payload);
        alert.show({
          title: 'Saved',
          message: 'Blog post updated successfully.',
          severity: 'success',
        });
      }
    } catch (err) {
      alert.show({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Could not save blog post.',
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
        <Button component={RouterLink} to={ROUTES.adminBlog} variant="outlined">
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
          {isNew ? 'Post article' : `Edit ${title || routeId}`}
        </Typography>
        <Button component={RouterLink} to={ROUTES.adminBlog} variant="outlined">
          Cancel
        </Button>
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
        Required fields
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Blog ID"
        value={isNew ? 'Auto-generated on save (QDLBL-0001, …)' : blogId || '—'}
        disabled
        fullWidth
        helperText={
          isNew
            ? 'Server assigns the next ID: QDLBL-0001, QDLBL-0002, …'
            : 'Business blog ID (cannot be changed).'
        }
      />

      <TextField
        label="Slug"
        value={slug}
        onChange={(event) => {
          setSlugTouched(true);
          setSlug(
            event.target.value
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, '-')
              .replace(/--+/g, '-'),
          );
        }}
        required
        fullWidth
        disabled={!isNew}
        helperText={
          isNew
            ? 'Public URL: /blog/{slug}. Auto from title; you can edit. Locked after create.'
            : 'Cannot be changed after create.'
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            fullWidth
            required
          >
            {BLOG_CATEGORY_OPTIONS.map((option) => (
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
            label="Reading time"
            value={readingTimePreset}
            onChange={(event) => setReadingTimePreset(event.target.value)}
            fullWidth
            required
          >
            {BLOG_READING_TIME_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {readingTimePreset === 'Custom' ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Custom reading time"
              value={readingTimeCustom}
              onChange={(event) => setReadingTimeCustom(event.target.value)}
              fullWidth
              required
              placeholder="e.g. 12 min"
            />
          </Grid>
        ) : null}
      </Grid>

      <TextField
        label="Excerpt"
        value={excerpt}
        onChange={(event) => setExcerpt(event.target.value)}
        required
        multiline
        minRows={3}
        fullWidth
        helperText="Short summary shown on blog cards."
      />
      <TextField
        label="Tags"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        required
        multiline
        minRows={2}
        fullWidth
        helperText="One tag per line."
      />
      <TextField
        label="Content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
        multiline
        minRows={8}
        fullWidth
        helperText="One paragraph per line."
      />

      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, pt: 1 }}>
        Optional extras
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
        }
        label="Featured on blog home"
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
        {saving ? 'Saving…' : isNew ? 'Post article' : 'Save changes'}
      </Button>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => {
          alert.close();
          if (alert.severity === 'success') {
            navigate(ROUTES.adminBlog);
          }
        }}
      />
    </Stack>
  );
}

function toDateInputValue(value: string | undefined): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return new Date().toISOString().slice(0, 10);
  return new Date(parsed).toISOString().slice(0, 10);
}
