import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { siteImages } from '../assets/images';
import {
  AboutApproachSection,
  AboutAudiencesSection,
  AboutJourneySection,
  AboutOfferingsSection,
  AboutPracticesSection,
  AboutPresenceSection,
  AboutStorySection,
  AboutValuesSection,
  AboutVisionMission,
  AboutWhyChooseSection,
  AppBreadcrumbs,
  CTASection,
  PageContainer,
  RouterButton,
  TechCapabilitiesPyramid,
} from '../components';
import type { AboutValueItem } from '../components/about';
import { COMPANY, ROUTES } from '../constants';
import {
  ABOUT_SNAPSHOT,
  DEFAULT_JOURNEY,
  DEFAULT_MISSION,
  DEFAULT_VALUES,
  DEFAULT_VISION,
  DEFAULT_WHY,
  VALUE_ACCENTS,
} from '../data/about';
import { fetchAbout, type AboutContent } from '../services';

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
  const values = mapAboutValues(about?.values);

  return (
    <PageContainer contained={false}>
      <Box
        component="section"
        sx={{
          position: 'relative',
          color: 'common.white',
          overflow: 'hidden',
          backgroundImage: `
            linear-gradient(112deg, rgba(7, 24, 40, 0.92) 0%, rgba(12, 35, 64, 0.78) 48%, rgba(12, 35, 64, 0.55) 100%),
            url(${siteImages.team})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 50% 60% at 85% 20%, rgba(184, 149, 107, 0.18) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 5, md: 8 } }}>
          <AppBreadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'About' },
            ]}
          />
          <Stack spacing={2.5} sx={{ maxWidth: 760, mt: 1 }}>
            <Typography variant="overline" sx={{ color: 'accent.light', letterSpacing: '0.16em' }}>
              {COMPANY.legalName}
            </Typography>
            <Typography
              component="h1"
              variant="h2"
              sx={{ color: 'common.white', fontSize: { xs: '2.15rem', md: '3rem' } }}
            >
              About {COMPANY.shortName}
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.88, fontSize: '1.0625rem', lineHeight: 1.8, maxWidth: 640 }}
            >
              A technology and talent company in Hyderabad — delivering digital services while
              creating structured paths for students, interns, and professionals. Founded in{' '}
              {COMPANY.founded}. Promise: {COMPANY.tagline}.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 0.5 }}>
              <RouterButton
                to={ROUTES.quote}
                variant="contained"
                sx={{
                  bgcolor: 'accent.main',
                  color: 'accent.contrastText',
                  fontWeight: 700,
                  px: 3,
                  '&:hover': { bgcolor: 'accent.light' },
                }}
              >
                Get a Quote
              </RouterButton>
              <RouterButton
                to={ROUTES.contact}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'common.white',
                  '&:hover': {
                    borderColor: 'accent.light',
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                Contact Us
              </RouterButton>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderColor: 'rgba(255,255,255,0.16)',
                  display: { xs: 'none', sm: 'block' },
                }}
              />
            }
            spacing={{ xs: 2, sm: 4 }}
            sx={{
              mt: { xs: 4, md: 6 },
              pt: 3,
              borderTop: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {ABOUT_SNAPSHOT.map((stat) => (
              <Box key={stat.label}>
                <Typography
                  variant="overline"
                  sx={{ color: 'accent.light', display: 'block', mb: 0.5 }}
                >
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 600 }}>
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5.5 },
        }}
      >
        <AboutStorySection />
        <AboutVisionMission vision={vision} mission={mission} />
        <AboutValuesSection values={values} />
        <AboutOfferingsSection />
        <AboutAudiencesSection />
        <AboutApproachSection />
        <AboutPracticesSection />
        <TechCapabilitiesPyramid />
        <AboutWhyChooseSection points={whyChoose} />
        <AboutJourneySection items={journey} />
        <AboutPresenceSection />
        <CTASection
          title="Ready to explore how we can help?"
          description="Tell us about a product, a hiring need, a training cohort, or an internship — we will point you to the right next step."
          primaryLabel="Explore Services"
          primaryTo={ROUTES.services}
          secondaryLabel="Contact Us"
          secondaryTo={ROUTES.contact}
        />
      </Box>
    </PageContainer>
  );
}

function mapAboutValues(
  incoming: AboutContent['values'] | undefined,
): AboutValueItem[] {
  const source =
    incoming && incoming.length > 0 ? incoming : DEFAULT_VALUES;
  return source.map((item, index) => ({
    title: item.title,
    description: item.description,
    accent: item.accent?.trim() || VALUE_ACCENTS[index % VALUE_ACCENTS.length],
  }));
}
