import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../constants';

const SECTIONS = [
  {
    title: 'Services',
    description: 'Categories and nested service offerings.',
    path: ROUTES.adminServices,
  },
  {
    title: 'Jobs',
    description: 'Open roles and job listing details.',
    path: ROUTES.adminJobs,
  },
  {
    title: 'Internships',
    description: 'Internship programs and tracks.',
    path: ROUTES.adminInternships,
  },
  {
    title: 'Projects',
    description: 'Demo projects and delivery showcases.',
    path: ROUTES.adminProjects,
  },
  {
    title: 'Portfolio',
    description: 'Case studies and portfolio entries.',
    path: ROUTES.adminPortfolio,
  },
  {
    title: 'Blog',
    description: 'Articles and company updates.',
    path: ROUTES.adminBlog,
  },
  {
    title: 'About',
    description: 'Vision, mission, journey, and values.',
    path: ROUTES.adminAbout,
  },
  {
    title: 'Applications',
    description: 'Job and internship applicant statuses.',
    path: ROUTES.adminApplications,
  },
] as const;

export function AdminDashboardPage() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
          Manage public site content. Edit JSON payloads for each item, then publish
          or unpublish as needed.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {SECTIONS.map((section) => (
          <Grid key={section.path} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={0} sx={cardSx}>
              <CardActionArea component={RouterLink} to={section.path} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

const cardSx = {
  height: '100%',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    borderColor: 'accent.main',
    boxShadow: '0 8px 24px rgba(12, 35, 64, 0.08)',
  },
} as const;
