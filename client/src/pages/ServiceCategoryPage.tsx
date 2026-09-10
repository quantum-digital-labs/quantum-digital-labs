import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Navigate, useParams } from 'react-router-dom';
import { serviceCategoryImages } from '../assets/images';
import {
  AppBreadcrumbs,
  CTASection,
  PageContainer,
  SectionHeader,
  ServiceCard,
} from '../components';
import { ROUTES } from '../constants';
import { getCategoryById } from '../data';
import { useContentItem } from '../hooks';
import {
  DEFAULT_SERVICE_COVER,
  fetchServiceCategory,
  isUploadedImageUrl,
  resolveMediaUrl,
} from '../services';
import type { ServiceItem } from '../types/content';

function uniqueTechs(items: string[][]): string[] {
  const set = new Set<string>();
  items.flat().forEach((tech) => set.add(tech));
  return [...set];
}

function resolveServiceImage(
  item: ServiceItem,
  categoryId: string,
): string {
  if (item.image && isUploadedImageUrl(item.image)) {
    return resolveMediaUrl(item.image);
  }
  return (
    serviceCategoryImages[categoryId as keyof typeof serviceCategoryImages] ??
    resolveMediaUrl(DEFAULT_SERVICE_COVER)
  );
}

export function ServiceCategoryPage() {
  const { categoryId = '' } = useParams();
  const { item: category, loading } = useContentItem(
    categoryId,
    fetchServiceCategory,
    getCategoryById,
  );

  if (loading && !category) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading category…</Typography>
      </PageContainer>
    );
  }

  if (!category) {
    return <Navigate to={ROUTES.services} replace />;
  }

  const cover = serviceCategoryImages[category.id];
  const allTechs = uniqueTechs(category.services.map((item) => item.technologies));

  return (
    <PageContainer contained={false}>
      <Box
        component="section"
        sx={{
          position: 'relative',
          color: 'common.white',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(110deg, rgba(7, 42, 80, 0.9) 0%, rgba(11, 58, 110, 0.76) 50%, rgba(0, 151, 167, 0.4) 100%), url(${cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: { xs: 4.5, md: 6.5 },
          }}
        >
          <AppBreadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'Services', to: ROUTES.services },
              { label: category.title },
            ]}
          />
          <Stack spacing={1.75} sx={{ maxWidth: 760, mt: 2 }}>
            <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1.1 }}>
              Services → {category.title}
            </Typography>
            <Typography component="h1" variant="h2" sx={{ color: 'common.white' }}>
              {category.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.92, fontSize: '1.05rem' }}>
              {category.description}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {category.services.length} service types in this category. Open any type for
              full details, deliverables, and tech stack.
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
        <Box sx={techPanelSx}>
          <Stack spacing={1.5}>
            <Typography variant="h5">Tech stack at a glance</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
              Tools and technologies commonly used across {category.title.toLowerCase()}.
              Each service type below shows its own stack in more detail.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {allTechs.map((tech) => (
                <Chip key={tech} label={tech} color="primary" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </Box>

        <SectionHeader
          title="Types of services"
          subtitle="Pick a service type to see features, process, and technologies."
        />
        <Grid container spacing={2.5}>
          {category.services.map((item) => (
            <Grid key={item.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <ServiceCard
                title={item.title}
                description={item.shortDescription}
                to={ROUTES.serviceDetail(category.id, item.slug)}
                image={resolveServiceImage(item, category.id)}
                imageAlt={`${item.title} — ${category.title}`}
                techs={item.technologies}
                meta="Service type"
              />
            </Grid>
          ))}
        </Grid>

        <CTASection
          title={`Request a quote for ${category.title}`}
          primaryLabel="Request Quote"
          primaryTo={`${ROUTES.quote}?category=${category.id}`}
          secondaryLabel="Back to Services"
          secondaryTo={ROUTES.services}
        />
      </Box>
    </PageContainer>
  );
}

const techPanelSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  backgroundImage:
    'linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(216,232,248,0.55) 100%)',
} as const;
