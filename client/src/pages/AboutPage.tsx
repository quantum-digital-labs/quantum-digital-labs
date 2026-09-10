import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { siteImages } from '../assets/images';
import { AboutValuesSection, CTASection, PageContainer, SectionHeader, TechCapabilitiesPyramid } from '../components';
import { COMPANY, ROUTES } from '../constants';
import { fetchAbout, type AboutContent } from '../services';

const DEFAULT_JOURNEY = [
  {
    title: 'May 2026 — Launch',
    text: 'Quantum Digital Labs began operations with a focused mix of technology, staffing, training, and marketing services.',
  },
  {
    title: 'First platform journeys',
    text: 'Built clear paths for services, careers, internships, projects, and sample portfolio case studies.',
  },
  {
    title: 'Talent + delivery together',
    text: 'Connected client work with internship roles and hiring loops so learning stays practical.',
  },
  {
    title: 'Today',
    text: 'A young company shipping in public — refining demos, content, and partner-ready experiences.',
  },
] as const;

const DEFAULT_VISION =
  'To become a trusted digital and talent solutions partner by creating innovative technology solutions, developing skilled professionals, and enabling organizations to grow through technology and people.';

const DEFAULT_MISSION =
  'Our mission is to deliver reliable technology, staffing, training, digital marketing, and project solutions while creating meaningful career and learning opportunities for students and professionals.';

const DEFAULT_WHY = [
  'End-to-end delivery with transparent milestones',
  'Talent pathways through training and internships',
  'Long-term support beyond launch day',
] as const;

export function AboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    fetchAbout()
      .then(setAbout)
      .catch(() => setAbout(null));
  }, []);

  const journey =
    about?.journey && about.journey.length > 0 ? about.journey : DEFAULT_JOURNEY;
  const vision = about?.vision?.trim() || DEFAULT_VISION;
  const mission = about?.mission?.trim() || DEFAULT_MISSION;
  const whyChoose =
    about?.whyChoose && about.whyChoose.length > 0 ? about.whyChoose : DEFAULT_WHY;
  return (
    <PageContainer>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          alignItems: 'center',
        }}
      >
        <Stack spacing={1.5}>
          <Typography component="h1" variant="h2">
            About {COMPANY.shortName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            Quantum Digital Labs Pvt. Ltd. started in {COMPANY.founded} as a technology and
            talent solutions company — helping businesses grow through digital services while
            creating meaningful opportunities for students, interns, and professionals.
          </Typography>
        </Stack>
        <Box
          component="img"
          src={siteImages.team}
          alt="Quantum Digital Labs collaborative workspace"
          sx={{
            width: '100%',
            height: { xs: 220, md: 300 },
            objectFit: 'cover',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 3,
          }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={panelSx}>
            <Typography variant="h5" gutterBottom>
              Vision
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {vision}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={panelSx}>
            <Typography variant="h5" gutterBottom>
              Mission
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mission}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <AboutValuesSection />

      <section>
        <SectionHeader
          title="Team"
          subtitle="A cross-functional team across engineering, design, marketing, training, and recruitment."
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Leadership and team profiles will be published here once official company
          information is provided. Until then, this section intentionally avoids invented
          names or titles.
        </Typography>
      </section>

      <TechCapabilitiesPyramid />

      <Box
        component="section"
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 4.5 },
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          alignItems: 'center',
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 12px 36px rgba(12, 35, 64, 0.06)',
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
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: 520 }}>
            We combine practical technology delivery with training, internships, and staffing
            pathways. That means clearer outcomes for clients and meaningful progress for the
            people building alongside us.
          </Typography>
          <Stack spacing={1.25} sx={{ pt: 0.5 }}>
            {whyChoose.map((point) => (
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
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
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
              height: { xs: 220, md: 320 },
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

      <section>
        <SectionHeader title="Company journey" />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {journey.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
              <Box sx={panelSx}>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </section>

      <CTASection
        title="Ready to explore how we can help?"
        primaryLabel="Explore Services"
        primaryTo={ROUTES.services}
        secondaryLabel="Contact Us"
        secondaryTo={ROUTES.contact}
      />
    </PageContainer>
  );
}

const panelSx = {
  p: 2.5,
  height: '100%',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  background: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(232,241,251,0.9))',
} as const;
