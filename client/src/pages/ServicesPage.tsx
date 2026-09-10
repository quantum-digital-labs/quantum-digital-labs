import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { serviceCategoryImages, siteImages } from '../assets/images';
import {
  AppBreadcrumbs,
  CTASection,
  PageContainer,
  SectionHeader,
  ServiceCard,
} from '../components';
import { ROUTES } from '../constants';
import { SERVICE_CATEGORIES } from '../data';
import { useContentList } from '../hooks';
import { fetchServices } from '../services';
import type { ServiceCategory } from '../types/content';

const FLOW_STEPS = [
  {
    step: '01',
    title: 'Pick a category',
    detail: 'IT, Marketing, Staffing, Training, and more.',
  },
  {
    step: '02',
    title: 'Choose a service type',
    detail: 'See what is included and the tech stack used.',
  },
  {
    step: '03',
    title: 'Request a quote',
    detail: 'Tell us your goals and we will follow up.',
  },
] as const;

function categoryTechPreview(category: ServiceCategory): string[] {
  const unique = new Set<string>();
  category.services.forEach((service) => {
    service.technologies.forEach((tech) => unique.add(tech));
  });
  return [...unique].slice(0, 5);
}

export function ServicesPage() {
  const { items: categories } = useContentList(fetchServices, SERVICE_CATEGORIES);
  return (
    <PageContainer contained={false}>
      <Box
        component="section"
        sx={{
          position: 'relative',
          color: 'common.white',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(110deg, rgba(7, 42, 80, 0.9) 0%, rgba(11, 58, 110, 0.78) 48%, rgba(0, 151, 167, 0.42) 100%), url(${siteImages.serviceIt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: { xs: 5, md: 7 },
          }}
        >
          <AppBreadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'Services' },
            ]}
          />
          <Stack spacing={2} sx={{ maxWidth: 720, mt: 2 }}>
            <Typography component="h1" variant="h2" sx={{ color: 'common.white' }}>
              Services
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.92, fontSize: '1.05rem' }}>
              A clear path from category to service type — so you know what we deliver
              and which technologies power each engagement.
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
          title="How to explore"
          subtitle="Three short steps — Services → Category → Service type."
        />
        <Grid container spacing={2}>
          {FLOW_STEPS.map((item) => (
            <Grid key={item.step} size={{ xs: 12, md: 4 }}>
              <Box sx={flowCardSx}>
                <Typography
                  variant="overline"
                  sx={{ color: 'accent.dark', fontWeight: 800, letterSpacing: 1.2 }}
                >
                  Step {item.step}
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {item.detail}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <SectionHeader
          title="Service categories"
          subtitle="Open a category to browse service types and their tech stacks."
        />
        <Grid container spacing={2.5}>
          {categories.map((category) => {
            const techs = categoryTechPreview(category);
            return (
              <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ServiceCard
                  title={category.title}
                  description={category.description}
                  to={category.path}
                  image={serviceCategoryImages[category.id]}
                  imageAlt={`${category.title} services`}
                  meta={`${category.services.length} service types`}
                  techs={techs}
                />
              </Grid>
            );
          })}
        </Grid>

        <Box sx={spotlightSx}>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src={siteImages.serviceMarketing}
                alt="Digital marketing and analytics workspace"
                sx={{
                  width: '100%',
                  height: { xs: 220, md: 280 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  display: 'block',
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={1.5}>
                <Typography variant="h4">Built around clear tech stacks</Typography>
                <Typography variant="body1" color="text.secondary">
                  Every service type lists the tools and technologies we use — from React
                  and Node.js to SEO platforms and CRM systems — so you can evaluate fit
                  before requesting a quote.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {['React', 'TypeScript', 'Node.js', 'Cloud', 'SEO', 'Analytics'].map(
                    (label) => (
                      <Chip key={label} label={label} color="primary" variant="outlined" />
                    ),
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <CTASection
          title="Need help choosing a service?"
          primaryLabel="Get a Quote"
          primaryTo={ROUTES.quote}
          secondaryLabel="Contact Us"
          secondaryTo={ROUTES.contact}
        />
      </Box>
    </PageContainer>
  );
}

const flowCardSx = {
  height: '100%',
  p: { xs: 2.5, md: 3 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  backgroundImage:
    'linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(212,244,248,0.45) 100%)',
} as const;

const spotlightSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
