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
import Button from '@mui/material/Button';
import {
  AppBreadcrumbs,
  PageContainer,
  RouterButton,
} from '../../components';
import { ROUTES } from '../../constants';
import { getInternshipById } from '../../data';
import { useContentItem, useMyApplications } from '../../hooks';
import { fetchInternship } from '../../services';

export function InternshipDetailPage() {
  const { internshipId = '' } = useParams();
  const { item, loading } = useContentItem(
    internshipId,
    fetchInternship,
    getInternshipById,
  );
  const { hasAppliedInternship } = useMyApplications();
  const alreadyApplied = hasAppliedInternship(internshipId);

  if (loading && !item) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading internship…</Typography>
      </PageContainer>
    );
  }

  if (!item) {
    return <Navigate to={ROUTES.internships} replace />;
  }

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Internships', to: ROUTES.internships },
          { label: item.role },
        ]}
      />

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                <Typography
                  variant="caption"
                  color="secondary"
                  sx={{ fontWeight: 700, letterSpacing: 0.4 }}
                >
                  {item.domain} · Internship role
                </Typography>
                {alreadyApplied ? (
                  <Chip size="small" label="Applied" color="success" />
                ) : null}
              </Stack>
              <Typography component="h1" variant="h2">
                {item.role}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
                {item.summary}
              </Typography>
            </Stack>

            <Box sx={overviewBoxSx}>
              <Grid container spacing={2}>
                <OverviewItem label="Domain" value={item.domain} />
                <OverviewItem label="Duration" value={item.duration} />
                <OverviewItem label="Mode" value={item.mode} />
                <OverviewItem label="Certificate" value="On completion" />
                {item.workMode ? (
                  <OverviewItem label="Work mode" value={item.workMode} />
                ) : null}
                {typeof item.openings === 'number' ? (
                  <OverviewItem label="Openings" value={String(item.openings)} />
                ) : null}
                {item.stipend ? (
                  <OverviewItem label="Stipend" value={item.stipend} />
                ) : null}
                {item.startDate ? (
                  <OverviewItem
                    label="Start date"
                    value={formatDeadline(item.startDate)}
                  />
                ) : null}
                {item.endDate || item.applicationDeadline ? (
                  <OverviewItem
                    label="End date"
                    value={formatDeadline(item.endDate ?? item.applicationDeadline!)}
                  />
                ) : null}
              </Grid>
            </Box>

            <Box sx={techStackSx}>
              <Stack spacing={1.5}>
                <Typography variant="h5">Tech stack</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tools and technologies you will practice in this role.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {item.technologies.map((tech) => (
                    <Chip key={tech} label={tech} color="primary" />
                  ))}
                </Stack>
              </Stack>
            </Box>

            <DetailSection
              title="What you will do"
              description="Day-to-day responsibilities for this internship role."
            >
              <BulletList items={item.responsibilities} />
            </DetailSection>

            <DetailSection
              title="Eligibility"
              description="Who this internship role is designed for."
            >
              <BulletList items={item.eligibility} />
            </DetailSection>

            <DetailSection title="Skills you will build" description="Practical skill focus.">
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {item.skills.map((skill) => (
                  <Chip key={skill} label={skill} variant="outlined" color="primary" />
                ))}
              </Stack>
            </DetailSection>

            <DetailSection title="Projects" description="Sample work you may complete.">
              <BulletList items={item.projects} />
            </DetailSection>

            <DetailSection
              title="Learning outcomes"
              description="What you should be able to do by the end."
            >
              <BulletList items={item.learningOutcomes} />
            </DetailSection>

            <DetailSection title="Benefits" description="Support included with the program.">
              <BulletList items={item.benefits} />
            </DetailSection>

            <Box sx={sectionBoxSx}>
              <Typography variant="body2" color="text.secondary">
                {item.certificate}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={applyPanelSx}>
            <Stack spacing={2}>
              <Typography variant="h5">Ready to apply?</Typography>
              <Typography variant="body2" color="text.secondary">
                Submit your basic details for the <strong>{item.role}</strong> internship
                role. It only takes a few minutes.
              </Typography>
              <Divider />
              <Stack spacing={1}>
                <MetaRow label="Domain" value={item.domain} />
                <MetaRow label="Duration" value={item.duration} />
                <MetaRow label="Mode" value={item.mode} />
                {item.workMode ? <MetaRow label="Work mode" value={item.workMode} /> : null}
                {item.stipend ? <MetaRow label="Stipend" value={item.stipend} /> : null}
                {typeof item.openings === 'number' ? (
                  <MetaRow label="Openings" value={String(item.openings)} />
                ) : null}
                {item.startDate ? (
                  <MetaRow label="Start date" value={formatDeadline(item.startDate)} />
                ) : null}
                {item.endDate || item.applicationDeadline ? (
                  <MetaRow
                    label="End date"
                    value={formatDeadline(item.endDate ?? item.applicationDeadline!)}
                  />
                ) : null}
              </Stack>
              <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                {alreadyApplied ? (
                  <Button variant="contained" fullWidth disabled>
                    Applied
                  </Button>
                ) : (
                  <RouterButton
                    to={ROUTES.internshipApply(item.id)}
                    variant="contained"
                    fullWidth
                  >
                    Apply for this role
                  </RouterButton>
                )}
                <RouterButton to={ROUTES.internships} variant="outlined" fullWidth>
                  Back to all roles
                </RouterButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

function formatDeadline(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
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
          <ListItemText
            primary={entry}
            slotProps={{ primary: { variant: 'body2' } }}
          />
        </ListItem>
      ))}
    </List>
  );
}

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

const applyPanelSx = {
  position: { md: 'sticky' },
  top: { md: 96 },
  p: { xs: 2.5, md: 3 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
