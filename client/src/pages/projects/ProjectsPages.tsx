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
import { projectImages, siteImages } from '../../assets/images';
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
  PROJECT_CATEGORIES,
  PROJECTS,
  getProjectById,
  type ProjectItem,
} from '../../data';
import { useContentItem, useContentList } from '../../hooks';
import {
  DEFAULT_PROJECT_SCREENSHOT,
  fetchProject,
  fetchProjects,
  isUploadedImageUrl,
  resolveMediaUrl,
} from '../../services';

export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { items: projects } = useContentList(fetchProjects, PROJECTS);

  const categoryOptions = useMemo(() => {
    const fromItems = projects.map((item) => item.category).filter(Boolean);
    return [...new Set([...PROJECT_CATEGORIES, ...fromItems])].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.overview.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query));
      const matchesCategory = category === 'all' || project.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  return (
    <PageContainer contained={false}>
      <Box
        component="section"
        sx={{
          color: 'common.white',
          backgroundImage: `linear-gradient(110deg, rgba(7, 42, 80, 0.92) 0%, rgba(11, 58, 110, 0.78) 50%, rgba(0, 151, 167, 0.4) 100%), url(${siteImages.projectCorporateWeb})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 5, md: 7 } }}>
          <AppBreadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'Projects' },
            ]}
          />
          <Stack spacing={1.75} sx={{ maxWidth: 720, mt: 2 }}>
            <Typography component="h1" variant="h2" sx={{ color: 'common.white' }}>
              Projects
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.92, fontSize: '1.05rem' }}>
              Detailed delivery examples across web, hiring, training, marketing, and cloud —
              with clear tech stacks, outcomes, and demo-ready journeys.
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
          title="Browse projects"
          subtitle="Filter by category or technology to find the right case."
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Search projects"
              placeholder="Title, overview, or technology"
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
          {filtered.length} project{filtered.length === 1 ? '' : 's'}
        </Typography>

        <Grid container spacing={2.5}>
          {filtered.map((project) => (
            <Grid key={project.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>

        <CTASection
          title="Want a walkthrough?"
          primaryLabel="Request Demo"
          primaryTo={ROUTES.requestDemo}
          secondaryLabel="Back Home"
          secondaryTo={ROUTES.home}
        />
      </Box>
    </PageContainer>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const image = resolveProjectCover(project);

  return (
    <Card elevation={0} sx={cardSx}>
      <CardActionArea
        component={RouterLink}
        to={ROUTES.projectDetail(project.id)}
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
          alt={`${project.title} preview`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Typography variant="caption" color="secondary" sx={{ fontWeight: 700 }}>
            {project.category}
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main', lineHeight: 1.3 }}>
            {project.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {project.overview}
          </Typography>
          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {project.technologies.slice(0, 3).map((tech) => (
              <Chip key={tech} size="small" label={tech} variant="outlined" color="primary" />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {project.timeline} · {project.status}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const { item: project, loading } = useContentItem(
    projectId,
    fetchProject,
    getProjectById,
  );
  const { items: projects } = useContentList(fetchProjects, PROJECTS);

  if (loading && !project) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading project…</Typography>
      </PageContainer>
    );
  }

  if (!project) {
    return <Navigate to={ROUTES.projects} replace />;
  }

  const related = projects.filter((item) => project.relatedIds.includes(item.id));
  const image = resolveProjectCover(project);
  const screenshots = resolveProjectScreenshots(project);
  const demoPath = `${ROUTES.requestDemo}?project=${project.id}`;

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Projects', to: ROUTES.projects },
          { label: project.title },
        ]}
      />

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Box
              component="img"
              src={image}
              alt={`${project.title} visual`}
              sx={{
                width: '100%',
                height: { xs: 220, md: 320 },
                objectFit: 'cover',
                borderRadius: 2,
                display: 'block',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />

            <Stack spacing={1.25}>
              <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
                {project.category}
              </Typography>
              <Typography component="h1" variant="h2">
                {project.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {project.overview}
              </Typography>
            </Stack>

            <Box sx={overviewBoxSx}>
              <Grid container spacing={2}>
                <OverviewItem label="Client type" value={project.clientType} />
                <OverviewItem label="Timeline" value={project.timeline} />
                <OverviewItem label="Status" value={project.status} />
                <OverviewItem label="Category" value={project.category} />
              </Grid>
            </Box>

            <DetailSection title="Problem" description="The challenge this project addressed.">
              <Typography variant="body2" color="text.secondary">
                {project.problem}
              </Typography>
            </DetailSection>

            <DetailSection title="Solution" description="How we approached delivery.">
              <Typography variant="body2" color="text.secondary">
                {project.solution}
              </Typography>
            </DetailSection>

            <Box sx={techStackSx}>
              <Stack spacing={1.5}>
                <Typography variant="h5">Tech stack</Typography>
                <Typography variant="body2" color="text.secondary">
                  Technologies used to design and build this project.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {project.technologies.map((tech) => (
                    <Chip key={tech} label={tech} color="primary" />
                  ))}
                </Stack>
              </Stack>
            </Box>

            <DetailSection title="Features" description="Key capabilities included.">
              <BulletList items={project.features} />
            </DetailSection>

            <DetailSection title="Deliverables" description="What was produced.">
              <BulletList items={project.deliverables} />
            </DetailSection>

            <DetailSection title="Results" description="Outcomes after delivery.">
              <BulletList items={project.results} />
            </DetailSection>

            <DetailSection
              title="Screenshots"
              description="Visual views from this project experience."
            >
              <Grid container spacing={2}>
                {screenshots.map((src, index) => (
                  <Grid key={`${project.id}-shot-${index}`} size={{ xs: 12, sm: 6 }}>
                    <Box
                      component="img"
                      src={src}
                      alt={`${project.title} screenshot ${index + 1}`}
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
              <Typography variant="h5">Request a demo</Typography>
              <Typography variant="body2" color="text.secondary">
                Walk through <strong>{project.title}</strong> with our team and discuss how a
                similar delivery could fit your goals.
              </Typography>
              <Divider />
              <Stack spacing={1}>
                <MetaRow label="Timeline" value={project.timeline} />
                <MetaRow label="Status" value={project.status} />
                <MetaRow label="Focus" value={project.technologies.slice(0, 2).join(', ')} />
              </Stack>
              <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                <RouterButton to={demoPath} variant="contained" fullWidth>
                  Request Demo
                </RouterButton>
                <RouterButton to={ROUTES.projects} variant="outlined" fullWidth>
                  Back to projects
                </RouterButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {related.length > 0 ? (
        <Box component="section">
          <Typography variant="h4" gutterBottom>
            Related projects
          </Typography>
          <Grid container spacing={2}>
            {related.map((item) => (
              <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                <ContentCard
                  title={item.title}
                  meta={item.category}
                  description={item.overview}
                  to={ROUTES.projectDetail(item.id)}
                  image={resolveProjectCover(item)}
                  imageAlt={`${item.title} preview`}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      <CTASection
        title="Ready to explore a similar build?"
        description="Request a demo and return to projects after confirmation."
        primaryLabel="Request Demo"
        primaryTo={demoPath}
        secondaryLabel="Back to Projects"
        secondaryTo={ROUTES.projects}
      />
    </PageContainer>
  );
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

function resolveProjectScreenshots(project: ProjectItem): string[] {
  const urls = (project.screenshots ?? [])
    .filter(isUploadedImageUrl)
    .map((url) => resolveMediaUrl(url));
  if (urls.length > 0) return urls;
  return [resolveMediaUrl(DEFAULT_PROJECT_SCREENSHOT)];
}

function resolveProjectCover(project: ProjectItem): string {
  if (project.image && isUploadedImageUrl(project.image)) {
    return resolveMediaUrl(project.image);
  }
  const shots = resolveProjectScreenshots(project);
  if (shots[0] && !shots[0].includes(DEFAULT_PROJECT_SCREENSHOT)) {
    return shots[0];
  }
  return projectImages[project.id] ?? siteImages.digital;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <List dense disablePadding>
      {items.map((item) => (
        <ListItem key={item} sx={{ px: 0, alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
            <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={item} slotProps={{ primary: { variant: 'body2' } }} />
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

const galleryImageSx = {
  width: '100%',
  height: { xs: 160, md: 200 },
  objectFit: 'cover',
  borderRadius: 2,
  display: 'block',
  border: '1px solid',
  borderColor: 'divider',
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
