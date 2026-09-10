import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { siteImages } from '../../assets/images';
import { COMPANY, COMPANY_MAPS_URL, ROUTES } from '../../constants';
import {
  ABOUT_APPROACH,
  ABOUT_AUDIENCES,
  ABOUT_PILLARS,
  ABOUT_PRACTICES,
  ABOUT_STORY,
} from '../../data/about';
import { cardSurface, sectionPanel } from '../../theme/surfaces';
import { ServiceCard } from '../cards';
import { CompanyContactDetails } from '../common/CompanyContactDetails';
import { RouterButton } from '../common/RouterButton';
import { SectionHeader } from '../common/SectionHeader';

const audienceIcons = [
  BusinessCenterOutlinedIcon,
  WorkOutlineOutlinedIcon,
  SchoolOutlinedIcon,
  ApartmentOutlinedIcon,
] as const;

export function AboutStorySection() {
  return (
    <Box
      component="section"
      sx={{
        ...sectionPanel,
        display: 'grid',
        gap: { xs: 3, md: 4.5 },
        gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
        alignItems: 'center',
      }}
    >
      <Stack spacing={2}>
        <SectionHeader
          eyebrow="Our story"
          title="Technology delivery and talent, under one roof"
          subtitle="A Hyderabad company built so businesses can ship, and people can grow, without treating those as separate problems."
        />
        {ABOUT_STORY.map((paragraph) => (
          <Typography
            key={paragraph.slice(0, 48)}
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8, maxWidth: 640 }}
          >
            {paragraph}
          </Typography>
        ))}
      </Stack>
      <Box sx={{ position: 'relative' }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: { xs: 10, md: 16 },
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'accent.light',
            opacity: 0.4,
            transform: 'translate(12px, 12px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          component="img"
          src={siteImages.team}
          alt="Quantum Digital Labs collaborative workspace"
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 240, md: 360 },
            objectFit: 'cover',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
}

export function AboutOfferingsSection() {
  return (
    <Box component="section">
      <SectionHeader
        eyebrow="What we do"
        title="Six connected practices"
        subtitle="Each practice has its own catalogue. Together they cover build, operate, market, hire, and train."
        action={
          <RouterButton to={ROUTES.services} variant="text">
            All services
          </RouterButton>
        }
      />
      <Grid container spacing={2.5}>
        {ABOUT_PILLARS.map((pillar) => (
          <Grid key={pillar.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <ServiceCard
              title={pillar.title}
              description={pillar.description}
              to={pillar.path}
              image={pillar.image}
              imageAlt={pillar.imageAlt}
              techs={[...pillar.highlights]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function AboutAudiencesSection() {
  return (
    <Box component="section">
      <SectionHeader
        eyebrow="Who we serve"
        title="Four audiences, one operating model"
        subtitle="Clients, candidates, students, and institutions use different doors — the work behind them stays connected."
      />
      <Grid container spacing={2}>
        {ABOUT_AUDIENCES.map((audience, index) => {
          const Icon = audienceIcons[index] ?? BusinessCenterOutlinedIcon;
          return (
            <Grid key={audience.title} size={{ xs: 12, sm: 6 }}>
              <Stack
                spacing={1.25}
                sx={{
                  ...cardSurface,
                  height: '100%',
                  p: { xs: 2.25, md: 2.75 },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(184, 149, 107, 0.12)',
                    color: 'accent.dark',
                    '& .MuiSvgIcon-root': { fontSize: 22 },
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {audience.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {audience.text}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export function AboutApproachSection() {
  return (
    <Box component="section" sx={sectionPanel}>
      <SectionHeader
        eyebrow="How we work"
        title="A four-stage partnership"
        subtitle="The same shape whether the brief is a product, a campaign, a hiring mandate, or a training cohort."
      />
      <Grid container spacing={2}>
        {ABOUT_APPROACH.map((item) => (
          <Grid key={item.step} size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1.25} sx={{ height: '100%' }}>
              <Typography
                variant="overline"
                sx={{ color: 'accent.dark', fontWeight: 800, letterSpacing: 1.4 }}
              >
                Stage {item.step}
              </Typography>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {item.text}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function AboutPracticesSection() {
  return (
    <Box component="section">
      <SectionHeader
        eyebrow="How we are organized"
        title="Cross-functional practices"
        subtitle="Leadership names and portraits will be published here once official profiles are released. Until then, this is how the work is grouped — without invented titles."
      />
      <Grid container spacing={2}>
        {ABOUT_PRACTICES.map((practice) => (
          <Grid key={practice.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                ...cardSurface,
                height: '100%',
                p: { xs: 2.25, md: 2.75 },
                borderLeft: '3px solid',
                borderLeftColor: 'accent.main',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                {practice.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {practice.text}
              </Typography>
            </Box>
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack
            spacing={1.5}
            sx={{
              ...cardSurface,
              height: '100%',
              p: { xs: 2.25, md: 2.75 },
              bgcolor: 'primary.dark',
              color: 'common.white',
              borderColor: 'rgba(184, 149, 107, 0.28)',
              '&:hover': {
                borderColor: 'rgba(184, 149, 107, 0.5)',
                transform: 'translateY(-3px)',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'common.white' }}>
              Join the team
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.82, lineHeight: 1.7 }}>
              Open roles and internship programs are listed as they are approved — with a full
              description and application form, not a generic inbox.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', pt: 0.5 }}>
              <RouterButton
                to={ROUTES.jobs}
                size="small"
                variant="contained"
                sx={{
                  bgcolor: 'accent.main',
                  color: 'accent.contrastText',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'accent.light' },
                }}
              >
                Careers
              </RouterButton>
              <RouterButton
                to={ROUTES.internships}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.35)',
                  color: 'common.white',
                  '&:hover': {
                    borderColor: 'accent.light',
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                Internships
              </RouterButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export function AboutJourneySection({
  items,
}: {
  items: readonly { title: string; text: string }[];
}) {
  return (
    <Box component="section">
      <SectionHeader
        eyebrow="Timeline"
        title="Company journey"
        subtitle="A short public record of how the company has taken shape since incorporation."
      />
      <Box
        sx={{
          position: 'relative',
          pl: { xs: 3.5, md: 4 },
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 8,
            bottom: 8,
            left: { xs: 11, md: 13 },
            width: 2,
            borderRadius: 1,
            background: (theme) =>
              `linear-gradient(180deg, ${theme.palette.accent.main}, ${theme.palette.primary.main})`,
            opacity: 0.45,
          },
        }}
      >
        <Stack spacing={2}>
          {items.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                ...cardSurface,
                position: 'relative',
                p: { xs: 2.25, md: 2.75 },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  left: { xs: -26, md: -27 },
                  top: 22,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  border: '3px solid',
                  borderColor: index === items.length - 1 ? 'primary.main' : 'accent.main',
                  zIndex: 1,
                }}
              />
              <Typography variant="overline" sx={{ color: 'accent.dark', fontWeight: 700 }}>
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.25, mb: 0.75 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export function AboutPresenceSection() {
  return (
    <Box
      component="section"
      sx={{
        ...sectionPanel,
        display: 'grid',
        gap: { xs: 3, md: 4 },
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        alignItems: 'center',
      }}
    >
      <Stack spacing={2}>
        <SectionHeader
          eyebrow="Presence"
          title="Based in Madhapur, Hyderabad"
          subtitle="We operate from Elite Business Center in VIP Hills — close to the city’s technology and talent corridor."
        />
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 560 }}>
          Hyderabad is where we hire, train, and deliver. Meetings, programs, and project work
          are coordinated from this studio. Reach us by email or phone, or open the address in
          Maps for directions.
        </Typography>
        <CompanyContactDetails tone="light" />
      </Stack>
      <Stack spacing={2}>
        <Link
          href={COMPANY_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          aria-label="Open company location in Google Maps"
        >
          <Box
            component="img"
            src={siteImages.hero}
            alt={`${COMPANY.shortName} Hyderabad studio`}
            sx={{
              width: '100%',
              height: { xs: 220, md: 300 },
              objectFit: 'cover',
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              display: 'block',
            }}
          />
        </Link>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {COMPANY.address}
        </Typography>
      </Stack>
    </Box>
  );
}

export function AboutWhyChooseSection({ points }: { points: readonly string[] }) {
  return (
    <Box
      component="section"
      sx={{
        ...sectionPanel,
        display: 'grid',
        gap: { xs: 3, md: 4.5 },
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          top: -50,
          right: { xs: -40, md: '42%' },
          borderRadius: '42% 58% 55% 45% / 48% 40% 60% 52%',
          bgcolor: 'accent.main',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          eyebrow="Partnership"
          title="Why choose us"
          subtitle="Delivery discipline meets talent development — so businesses ship stronger solutions while people grow."
        />
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: 540 }}>
          We combine practical technology delivery with training, internships, and staffing
          pathways. That means clearer outcomes for clients and meaningful progress for the
          people building alongside us.
        </Typography>
        <Stack spacing={1.25} sx={{ pt: 0.5 }}>
          {points.map((point) => (
            <Stack key={point} direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  mt: 0.85,
                  borderRadius: '50%',
                  bgcolor: 'accent.main',
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                {point}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: { xs: 10, md: 14 },
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'accent.light',
            opacity: 0.45,
            transform: 'translate(10px, 10px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          component="img"
          src={siteImages.hero}
          alt="Teams collaborating on digital solutions"
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 240, md: 360 },
            objectFit: 'cover',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 16px 40px rgba(12, 35, 64, 0.14)',
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            bottom: 16,
            px: 1.5,
            py: 0.85,
            borderRadius: 999,
            bgcolor: 'rgba(7, 24, 40, 0.78)',
            backdropFilter: 'blur(8px)',
            color: 'common.white',
            border: '1px solid rgba(184, 149, 107, 0.35)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.04em' }}>
            Technology · Talent · Growth
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function AboutVisionMission({
  vision,
  mission,
}: {
  vision: string;
  mission: string;
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <DetailPanel
          eyebrow="Direction"
          title="Vision"
          body={vision}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DetailPanel
          eyebrow="Mandate"
          title="Mission"
          body={mission}
        />
      </Grid>
    </Grid>
  );
}

function DetailPanel({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: ReactNode;
}) {
  return (
    <Box
      sx={{
        ...cardSurface,
        height: '100%',
        p: { xs: 2.5, md: 3 },
        background: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(232,241,251,0.9))',
      }}
    >
      <Typography variant="overline" sx={{ color: 'accent.dark', display: 'block', mb: 0.75 }}>
        {eyebrow}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {body}
      </Typography>
    </Box>
  );
}
