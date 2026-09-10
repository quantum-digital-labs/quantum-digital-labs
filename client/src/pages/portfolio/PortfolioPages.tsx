import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import {
  getPortfolioGallery,
  portfolioCoverImages,
  siteImages,
} from '../../assets/images';
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
  PORTFOLIO,
  PORTFOLIO_CATEGORIES,
  getPortfolioById,
  type PortfolioItem,
} from '../../data';
import { useContentItem, useContentList } from '../../hooks';
import {
  fetchPortfolio,
  fetchPortfolioItem,
  isUploadedImageUrl,
  resolveMediaUrl,
} from '../../services';

export function PortfolioPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { items: portfolio } = useContentList(fetchPortfolio, PORTFOLIO);

  const categoryOptions = useMemo(() => {
    const fromItems = portfolio.map((item) => item.category).filter(Boolean);
    return [...new Set([...PORTFOLIO_CATEGORIES, ...fromItems])].sort();
  }, [portfolio]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return portfolio.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.overview.toLowerCase().includes(query) ||
        item.industry.toLowerCase().includes(query) ||
        item.technologies.some((tech) => tech.toLowerCase().includes(query));
      const matchesCategory = category === 'all' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [portfolio, search, category]);

  return (
    <PageContainer contained={false}>
      <Box
        component="section"
        sx={{
          color: 'common.white',
          backgroundImage: `linear-gradient(110deg, rgba(7, 42, 80, 0.92) 0%, rgba(11, 58, 110, 0.78) 48%, rgba(0, 151, 167, 0.4) 100%), url(${siteImages.portfolioGalleryWeb})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 5, md: 7 } }}>
          <AppBreadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'Portfolio' },
            ]}
          />
          <Stack spacing={1.75} sx={{ maxWidth: 740, mt: 2 }}>
            <Typography component="h1" variant="h2" sx={{ color: 'common.white' }}>
              Sample Portfolio
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.92, fontSize: '1.05rem' }}>
              Reference case studies for Quantum Digital Labs — open a sample, review the
              details and gallery, then explore the full case study.
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
        }}
      >
        <SectionHeader
          title="Browse sample work"
          subtitle="Flow: Portfolio → Sample detail → Case study → Quote."
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Search samples"
              placeholder="Title, industry, or technology"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <MenuItem value="all">All categories</MenuItem>
              {categoryOptions.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {filtered.length} sample{filtered.length === 1 ? '' : 's'}
        </Typography>

        <Grid container spacing={2.5}>
          {filtered.map((item) => (
            <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <PortfolioCard item={item} />
            </Grid>
          ))}
        </Grid>

        <CTASection
          title="Want something similar?"
          primaryLabel="Get a Quote"
          primaryTo={ROUTES.quote}
          secondaryLabel="Back Home"
          secondaryTo={ROUTES.home}
        />
      </Box>
    </PageContainer>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const image = resolvePortfolioCover(item);

  return (
    <Card elevation={0} sx={cardSx}>
      <CardActionArea
        component={RouterLink}
        to={ROUTES.portfolioDetail(item.id)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={`${item.title} cover`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent
          sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}
        >
          <Typography variant="caption" color="secondary" sx={{ fontWeight: 700 }}>
            {item.category} · {item.year}
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main', lineHeight: 1.3 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {item.overview}
          </Typography>
          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {item.technologies.slice(0, 3).map((tech) => (
              <Chip key={tech} size="small" label={tech} variant="outlined" color="primary" />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {item.industry} · {item.timeline}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function PortfolioDetailPage() {
  const { projectId = '' } = useParams();
  const { item, loading } = useContentItem(
    projectId,
    fetchPortfolioItem,
    getPortfolioById,
  );
  const { items: portfolio } = useContentList(fetchPortfolio, PORTFOLIO);

  if (loading && !item) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading portfolio item…</Typography>
      </PageContainer>
    );
  }

  if (!item) {
    return <Navigate to={ROUTES.portfolio} replace />;
  }

  const cover = resolvePortfolioCover(item);
  const gallery = resolvePortfolioGallery(item);
  const related = portfolio.filter((entry) => item.relatedIds.includes(entry.id));

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Portfolio', to: ROUTES.portfolio },
          { label: item.title },
        ]}
      />

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Box
              component="img"
              src={cover}
              alt={`${item.title} cover`}
              sx={heroImageSx}
            />

            <Stack spacing={1.25}>
              <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
                Sample portfolio · {item.category}
              </Typography>
              <Typography component="h1" variant="h2">
                {item.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {item.overview}
              </Typography>
            </Stack>

            <Box sx={overviewBoxSx}>
              <Grid container spacing={2}>
                <OverviewItem label="Industry" value={item.industry} />
                <OverviewItem label="Year" value={item.year} />
                <OverviewItem label="Timeline" value={item.timeline} />
                <OverviewItem label="Our role" value={item.role} />
              </Grid>
            </Box>

            <DetailSection title="Problem" description="What needed to improve.">
              <Typography variant="body2" color="text.secondary">
                {item.problem}
              </Typography>
            </DetailSection>

            <DetailSection title="Solution" description="How the sample was shaped.">
              <Typography variant="body2" color="text.secondary">
                {item.solution}
              </Typography>
            </DetailSection>

            <Box sx={techStackSx}>
              <Stack spacing={1.5}>
                <Typography variant="h5">Tech stack</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.technologyNarrative}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {item.technologies.map((tech) => (
                    <Chip key={tech} label={tech} color="primary" />
                  ))}
                </Stack>
              </Stack>
            </Box>

            <DetailSection title="Features" description="Capabilities shown in this sample.">
              <BulletList items={item.features} />
            </DetailSection>

            <DetailSection title="Deliverables" description="Reference outputs included.">
              <BulletList items={item.deliverables} />
            </DetailSection>

            <DetailSection title="Results" description="Outcomes this sample demonstrates.">
              <BulletList items={item.results} />
            </DetailSection>

            <DetailSection
              title="Gallery"
              description="Visual references for this sample portfolio piece."
            >
              <Grid container spacing={2}>
                {gallery.map((src, index) => (
                  <Grid key={`${item.id}-gallery-${index}`} size={{ xs: 12, sm: 4 }}>
                    <Box
                      component="img"
                      src={src}
                      alt={`${item.title} image ${index + 1}`}
                      sx={galleryImageSx}
                    />
                  </Grid>
                ))}
              </Grid>
            </DetailSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={sidePanelSx}>
            <Stack spacing={2}>
              <Typography variant="h5">Explore this sample</Typography>
              <Typography variant="body2" color="text.secondary">
                Open the full case study for challenge, strategy, and development detail —
                or start a similar project discussion.
              </Typography>
              <Divider />
              <Stack spacing={1}>
                {item.metrics.map((metric) => (
                  <MetaRow key={metric.label} label={metric.label} value={metric.value} />
                ))}
              </Stack>
              <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                <RouterButton
                  to={ROUTES.portfolioCaseStudy(item.id)}
                  variant="contained"
                  fullWidth
                >
                  View case study
                </RouterButton>
                <RouterButton to={ROUTES.quote} variant="outlined" fullWidth>
                  Start similar project
                </RouterButton>
                <RouterButton to={ROUTES.portfolio} variant="text" fullWidth>
                  Back to portfolio
                </RouterButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {related.length > 0 ? (
        <Box component="section">
          <Typography variant="h4" gutterBottom>
            Related samples
          </Typography>
          <Grid container spacing={2}>
            {related.map((entry) => (
              <Grid key={entry.id} size={{ xs: 12, md: 4 }}>
                <ContentCard
                  title={entry.title}
                  meta={`${entry.category} · ${entry.year}`}
                  description={entry.overview}
                  to={ROUTES.portfolioDetail(entry.id)}
                  image={resolvePortfolioCover(entry)}
                  imageAlt={`${entry.title} cover`}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      <CTASection
        title="Use this as a reference for your next build"
        primaryLabel="Get a Quote"
        primaryTo={ROUTES.quote}
        secondaryLabel="Back to Portfolio"
        secondaryTo={ROUTES.portfolio}
      />
    </PageContainer>
  );
}

export function PortfolioCaseStudyPage() {
  const { projectId = '' } = useParams();
  const { item, loading } = useContentItem(
    projectId,
    fetchPortfolioItem,
    getPortfolioById,
  );

  if (loading && !item) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading case study…</Typography>
      </PageContainer>
    );
  }

  if (!item) {
    return <Navigate to={ROUTES.portfolio} replace />;
  }

  const gallery = resolvePortfolioGallery(item);
  const steps = [
    { title: 'Challenge', body: item.challenge },
    { title: 'Strategy', body: item.strategy },
    { title: 'Development', body: item.development },
    { title: 'Technology', body: item.technologyNarrative },
    { title: 'Results', body: item.caseResults.join(' ') },
  ];

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Portfolio', to: ROUTES.portfolio },
          { label: item.title, to: ROUTES.portfolioDetail(item.id) },
          { label: 'Case Study' },
        ]}
      />

      <Stack spacing={1.5} sx={{ maxWidth: 780 }}>
        <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
          Case study · Sample reference
        </Typography>
        <Typography component="h1" variant="h2">
          {item.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A detailed walkthrough of the challenge, approach, build, and outcomes for this
          sample portfolio piece.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {gallery.map((src, index) => (
          <Grid key={`${item.id}-case-${index}`} size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src={src}
              alt={`${item.title} case image ${index + 1}`}
              sx={galleryImageSx}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {item.metrics.map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 4 }}>
            <Box sx={metricBoxSx}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {metric.label}
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {metric.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Stack spacing={2}>
        {steps.map((step, index) => (
          <Box key={step.title} sx={sectionBoxSx}>
            <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
              Step {index + 1}
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 0.5 }}>
              {step.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {step.body}
            </Typography>
          </Box>
        ))}
      </Stack>

      <DetailSection title="Case results" description="What this sample demonstrates in practice.">
        <BulletList items={item.caseResults} />
      </DetailSection>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <RouterButton to={ROUTES.quote} variant="contained">
          Start similar project
        </RouterButton>
        <RouterButton to={ROUTES.portfolioDetail(item.id)} variant="outlined">
          Back to sample
        </RouterButton>
        <RouterButton to={ROUTES.portfolio} variant="text">
          Back to portfolio
        </RouterButton>
      </Stack>
    </PageContainer>
  );
}

function resolvePortfolioGallery(item: PortfolioItem): string[] {
  const urls = (item.galleryLabels ?? [])
    .filter(isUploadedImageUrl)
    .map((url) => resolveMediaUrl(url));
  if (urls.length > 0) return urls;
  return getPortfolioGallery(item.id);
}

function resolvePortfolioCover(item: PortfolioItem): string {
  if (item.image && isUploadedImageUrl(item.image)) {
    return resolveMediaUrl(item.image);
  }
  const uploaded = (item.galleryLabels ?? []).filter(isUploadedImageUrl);
  const customUploads = uploaded.filter(
    (url) => !url.includes('/uploads/defaults/'),
  );
  if (customUploads[0]) {
    return resolveMediaUrl(customUploads[0]);
  }
  return portfolioCoverImages[item.id] ?? siteImages.digital;
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 6, sm: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Stack>
    </Grid>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Box component="section" sx={sectionBoxSx}>
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <List dense disablePadding>
      {items.map((entry) => (
        <ListItem key={entry} sx={{ px: 0, alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
            <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={entry} slotProps={{ primary: { variant: 'body2' } }} />
        </ListItem>
      ))}
    </List>
  );
}

const cardSx = {
  height: '100%',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: 'background.paper',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 4,
  },
} as const;

const heroImageSx = {
  width: '100%',
  height: { xs: 220, md: 320 },
  objectFit: 'cover',
  borderRadius: 2,
  display: 'block',
  border: '1px solid',
  borderColor: 'divider',
} as const;

const galleryImageSx = {
  width: '100%',
  height: { xs: 160, md: 180 },
  objectFit: 'cover',
  borderRadius: 2,
  display: 'block',
  border: '1px solid',
  borderColor: 'divider',
} as const;

const overviewBoxSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;

const techStackSx = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'primary.light',
  bgcolor: '#D4F4F8',
} as const;

const sectionBoxSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;

const sidePanelSx = {
  position: { md: 'sticky' },
  top: { md: 96 },
  p: { xs: 2.5, md: 3 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;

const metricBoxSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  height: '100%',
} as const;
