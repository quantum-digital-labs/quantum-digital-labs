import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { serviceCategoryImages } from '../assets/images';
import {
  AppBreadcrumbs,
  CTASection,
  PageContainer,
  RouterButton,
  ServiceCard,
} from '../components';
import { ROUTES } from '../constants';
import { getService } from '../data';
import { useEffect, useState } from 'react';
import {
  DEFAULT_SERVICE_COVER,
  fetchService,
  fetchServiceCategory,
  isUploadedImageUrl,
  resolveMediaUrl,
  type ServiceCategoryContent,
  type ServiceItemContent,
} from '../services';

function resolveServiceImage(
  item: ServiceItemContent,
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

export function ServiceDetailPage() {
  const { categoryId = '', serviceSlug = '' } = useParams();
  const staticMatch = getService(categoryId, serviceSlug);
  const [category, setCategory] = useState<ServiceCategoryContent | undefined>(
    staticMatch?.category,
  );
  const [service, setService] = useState<ServiceItemContent | undefined>(
    staticMatch?.service,
  );
  const [loading, setLoading] = useState(Boolean(categoryId && serviceSlug));

  useEffect(() => {
    if (!categoryId || !serviceSlug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const local = getService(categoryId, serviceSlug);
    setCategory(local?.category);
    setService(local?.service);
    setLoading(true);

    Promise.all([
      fetchServiceCategory(categoryId),
      fetchService(categoryId, serviceSlug),
    ])
      .then(([cat, svc]) => {
        if (cancelled) return;
        setCategory(cat);
        setService(svc);
      })
      .catch(() => {
        if (cancelled) return;
        setCategory(local?.category);
        setService(local?.service);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, serviceSlug]);

  if (loading && !service) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading service…</Typography>
      </PageContainer>
    );
  }

  if (!category || !service) {
    return <Navigate to={ROUTES.services} replace />;
  }

  const related = category.services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const quotePath = `${ROUTES.quote}?category=${category.id}&service=${service.slug}`;
  const cover = resolveServiceImage(service, category.id);

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Services', to: ROUTES.services },
          { label: category.title, to: category.path },
          { label: service.title },
        ]}
      />

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Box
              component="img"
              src={cover}
              alt={`${service.title} visual`}
              sx={{
                width: '100%',
                height: { xs: 200, md: 280 },
                objectFit: 'cover',
                borderRadius: 2,
                display: 'block',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />

            <Stack spacing={1.25}>
              <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
                {category.title} · Service type
              </Typography>
              <Typography component="h1" variant="h2">
                {service.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {service.description}
              </Typography>
            </Stack>

            <Box sx={techStackSx}>
              <Stack spacing={1.5}>
                <Typography variant="h5">Tech stack</Typography>
                <Typography variant="body2" color="text.secondary">
                  Technologies and tools used to deliver this service.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {(service.technologies ?? []).map((tech) => (
                    <Chip key={tech} label={tech} color="primary" />
                  ))}
                </Stack>
              </Stack>
            </Box>

            <DetailSection title="What you get" description="Core benefits of this engagement.">
              <BulletList items={service.benefits ?? []} />
            </DetailSection>

            <DetailSection title="Features" description="Included capabilities and focus areas.">
              <BulletList items={service.features ?? []} />
            </DetailSection>

            <DetailSection title="Process" description="How we typically work with you.">
              <BulletList items={service.process ?? []} />
            </DetailSection>

            <DetailSection title="Deliverables" description="What you receive at the end.">
              <BulletList items={service.deliverables ?? []} />
            </DetailSection>

            <Box component="section" sx={sectionBoxSx}>
              <Typography variant="h5" gutterBottom>
                FAQs
              </Typography>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {(service.faqs ?? []).map((faq) => (
                  <Box key={faq.question}>
                    <Typography variant="subtitle1" gutterBottom>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={sidePanelSx}>
            <Stack spacing={2}>
              <Typography variant="h5">Next step</Typography>
              <Typography variant="body2" color="text.secondary">
                Request a quote for <strong>{service.title}</strong>. We will review your
                requirements and follow up with next steps.
              </Typography>
              <Divider />
              <Stack spacing={1}>
                <MetaRow label="Category" value={category.title} />
                <MetaRow label="Service type" value={service.title} />
                <MetaRow
                  label="Tech focus"
                  value={(service.technologies ?? []).slice(0, 2).join(', ') || '—'}
                />
              </Stack>
              <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                <RouterButton to={quotePath} variant="contained" fullWidth>
                  Request Quote
                </RouterButton>
                <RouterButton to={category.path} variant="outlined" fullWidth>
                  Back to {category.title}
                </RouterButton>
                <RouterButton to={ROUTES.services} variant="text" fullWidth>
                  All categories
                </RouterButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {related.length > 0 ? (
        <Box component="section">
          <Typography variant="h4" gutterBottom>
            Related service types
          </Typography>
          <Grid container spacing={2}>
            {related.map((item) => (
              <Grid key={item.slug} size={{ xs: 12, md: 4 }}>
                <ServiceCard
                  title={item.title}
                  description={item.shortDescription}
                  to={ROUTES.serviceDetail(category.id, item.slug)}
                  image={resolveServiceImage(item, category.id)}
                  imageAlt={`${item.title} — ${category.title}`}
                  techs={item.technologies}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      <CTASection
        title="Ready to move forward?"
        description="Submit a quote request and return to this category after confirmation."
        primaryLabel="Request Quote"
        primaryTo={quotePath}
        secondaryLabel={`Back to ${category.title}`}
        secondaryTo={category.path}
      />
    </PageContainer>
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
      {items.map((item) => (
        <ListItem key={item} sx={{ px: 0, alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
            <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={item}
            slotProps={{ primary: { variant: 'body2' } }}
          />
        </ListItem>
      ))}
    </List>
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
