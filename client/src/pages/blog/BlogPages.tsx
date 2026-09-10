import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import {
  AppBreadcrumbs,
  ContentCard,
  CTASection,
  PageContainer,
  RouterButton,
  SectionHeader,
} from '../../components';
import { ROUTES } from '../../constants';
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  categoryToSlug,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesNewestFirst,
  getRelatedArticles,
  slugToCategory,
  type BlogArticle,
} from '../../data';
import { useContentItem, useContentList } from '../../hooks';
import { fetchBlog, fetchBlogPost } from '../../services';

function sortNewest(articles: BlogArticle[]): BlogArticle[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function BlogPage() {
  const [search, setSearch] = useState('');
  const { items } = useContentList(fetchBlog, BLOG_ARTICLES);
  const articles = useMemo(
    () => (items.length ? sortNewest(items) : getArticlesNewestFirst()),
    [items],
  );
  const featured = articles.filter((article) => article.featured);
  const query = search.trim().toLowerCase();
  const filtered = !query
    ? articles
    : articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      );

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Blog' },
        ]}
      />
      <Typography component="h1" variant="h2">
        Blog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
        Ideas from Quantum Digital Labs since our May 2026 launch — technology, careers,
        training, marketing, and company updates with clear next steps.
      </Typography>

      <TextField
        fullWidth
        label="Search articles"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <SectionHeader title="Categories" />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {BLOG_CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={category}
            component={RouterLink}
            to={ROUTES.blogCategory(categoryToSlug(category))}
            clickable
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>

      {featured.length > 0 ? (
        <>
          <SectionHeader title="Featured articles" />
          <Grid container spacing={2}>
            {featured.map((article) => (
              <Grid key={article.slug} size={{ xs: 12, md: 6 }}>
                <ContentCard
                  title={article.title}
                  meta={`${article.category} · ${article.readingTime}`}
                  description={article.excerpt}
                  to={ROUTES.blogDetail(article.slug)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      <SectionHeader title="Latest articles" />
      <Grid container spacing={2}>
        {filtered.map((article) => (
          <Grid key={article.slug} size={{ xs: 12, md: 4 }}>
            <ContentCard
              title={article.title}
              meta={`${article.category} · ${article.date}`}
              description={article.excerpt}
              to={ROUTES.blogDetail(article.slug)}
            />
          </Grid>
        ))}
      </Grid>

      <SectionHeader title="Tags" />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {[...new Set(articles.flatMap((article) => article.tags))].map((tag) => (
          <Chip key={tag} label={tag} variant="outlined" />
        ))}
      </Stack>

      <CTASection
        title="Want to talk about a topic?"
        primaryLabel="Contact Us"
        primaryTo={ROUTES.contact}
        secondaryLabel="Back Home"
        secondaryTo={ROUTES.home}
      />
    </PageContainer>
  );
}

export function BlogCategoryPage() {
  const { category = '' } = useParams();
  const categoryName = slugToCategory(category);
  const { items } = useContentList(fetchBlog, BLOG_ARTICLES);

  if (!categoryName) {
    return <Navigate to={ROUTES.blog} replace />;
  }

  const articles =
    items.length > 0
      ? sortNewest(
          items.filter(
            (article) =>
              article.category.toLowerCase() === categoryName.toLowerCase(),
          ),
        )
      : getArticlesByCategory(categoryName);

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Blog', to: ROUTES.blog },
          { label: categoryName },
        ]}
      />
      <Typography component="h1" variant="h2">
        {categoryName}
      </Typography>
      <Grid container spacing={2}>
        {articles.map((article) => (
          <Grid key={article.slug} size={{ xs: 12, md: 4 }}>
            <ContentCard
              title={article.title}
              meta={`${article.date} · ${article.readingTime}`}
              description={article.excerpt}
              to={ROUTES.blogDetail(article.slug)}
            />
          </Grid>
        ))}
      </Grid>
      <RouterButton to={ROUTES.blog} variant="outlined">
        Back to Blog
      </RouterButton>
    </PageContainer>
  );
}

export function BlogDetailPage() {
  const { slug = '' } = useParams();
  const { item: article, loading } = useContentItem(
    slug,
    fetchBlogPost,
    getArticleBySlug,
  );
  const { items } = useContentList(fetchBlog, BLOG_ARTICLES);

  if (loading && !article) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading article…</Typography>
      </PageContainer>
    );
  }

  if (!article) {
    return (
      <PageContainer>
        <Typography component="h1" variant="h2">
          Article Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This article does not exist or may have been moved.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <RouterButton to={ROUTES.blog} variant="contained">
            Back to Blog
          </RouterButton>
          <RouterButton to={ROUTES.home} variant="outlined">
            Back to Home
          </RouterButton>
        </Stack>
      </PageContainer>
    );
  }

  const related =
    items.length > 0
      ? items
          .filter(
            (item) =>
              item.slug !== article.slug &&
              (item.category === article.category ||
                item.tags.some((tag) => article.tags.includes(tag))),
          )
          .slice(0, 3)
      : getRelatedArticles(article.slug);

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Blog', to: ROUTES.blog },
          {
            label: article.category,
            to: ROUTES.blogCategory(categoryToSlug(article.category)),
          },
          { label: article.title },
        ]}
      />
      <Typography component="h1" variant="h2">
        {article.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {article.author} · {article.date} · {article.category} · {article.readingTime}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {article.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
      </Stack>
      {article.content.map((paragraph) => (
        <Typography key={paragraph} variant="body1" color="text.secondary">
          {paragraph}
        </Typography>
      ))}

      {related.length > 0 ? (
        <>
          <SectionHeader title="Related articles" />
          <Grid container spacing={2}>
            {related.map((item) => (
              <Grid key={item.slug} size={{ xs: 12, md: 4 }}>
                <ContentCard
                  title={item.title}
                  meta={item.category}
                  description={item.excerpt}
                  to={ROUTES.blogDetail(item.slug)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <RouterButton to={ROUTES.blog} variant="contained">
          Back to Blog
        </RouterButton>
        <RouterButton
          to={ROUTES.blogCategory(categoryToSlug(article.category))}
          variant="outlined"
        >
          More in {article.category}
        </RouterButton>
        <RouterButton to={ROUTES.home} variant="text">
          Back to Home
        </RouterButton>
      </Stack>
    </PageContainer>
  );
}
