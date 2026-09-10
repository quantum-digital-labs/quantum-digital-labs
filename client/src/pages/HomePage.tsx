import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { portfolioCoverImages, siteImages } from '../assets/images';
import {
  CapabilitiesSection,
  ContentCard,
  CTASection,
  PageContainer,
  PresentationSlide,
  ProcessMethodSection,
  RouterButton,
  SectionHeader,
  WhyQuantumSection,
} from '../components';
import { COMPANY, ROUTES } from '../constants';
import {
  PREVIEW_INTERNSHIPS,
  PREVIEW_JOBS,
  PREVIEW_PORTFOLIO,
  getPreviewBlogs,
} from '../data';
import { sectionPanel } from '../theme/surfaces';

const portfolioImages = PREVIEW_PORTFOLIO.slice(0, 3).map(
  (item) => portfolioCoverImages[item.id] ?? siteImages.digital,
);

const heroStats = [
  { label: 'Founded', value: COMPANY.founded },
  { label: 'Focus', value: 'Technology & Talent' },
  { label: 'Delivery', value: 'End-to-end' },
];

export function HomePage() {
  return (
    <PageContainer contained={false}>
      <PresentationSlide id="slide-hero" contained={false} delayMs={0}>
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 80px)' },
            display: 'flex',
            alignItems: 'flex-end',
            color: 'common.white',
            overflow: 'hidden',
            backgroundImage: `
              linear-gradient(112deg, rgba(7, 24, 40, 0.92) 0%, rgba(12, 35, 64, 0.78) 48%, rgba(12, 35, 64, 0.55) 100%),
              url(${siteImages.hero})
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
          <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 5, md: 9 } }}>
            <Stack spacing={3} sx={{ maxWidth: 780 }}>
              <Typography variant="overline" sx={{ color: 'accent.light', letterSpacing: '0.16em' }}>
                {COMPANY.legalName}
              </Typography>
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontSize: { xs: '2.35rem', sm: '2.85rem', md: '3.35rem' },
                  color: 'common.white',
                }}
              >
                Transforming ideas into dependable digital solutions
              </Typography>
              <Typography
                variant="body1"
                sx={{ maxWidth: 580, opacity: 0.86, fontSize: '1.0625rem', lineHeight: 1.8 }}
              >
                Technology, staffing, training, internships, and growth services — delivered with
                clarity, craft, and long-term partnership in mind.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 0.5 }}>
                <RouterButton
                  to={ROUTES.quote}
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
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
                  to={ROUTES.services}
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
                  Explore Services
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
              {heroStats.map((stat) => (
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
      </PresentationSlide>

      <PresentationSlide id="slide-capabilities" delayMs={40}>
        <CapabilitiesSection />
      </PresentationSlide>

      <PresentationSlide id="slide-why" delayMs={40}>
        <WhyQuantumSection />
      </PresentationSlide>

      <PresentationSlide id="slide-method" delayMs={40}>
        <ProcessMethodSection />
      </PresentationSlide>

      <PresentationSlide id="slide-work" delayMs={40}>
        <Box sx={sectionPanel}>
          <SectionHeader
            eyebrow="Work"
            title="Portfolio preview"
            subtitle="Selected samples — each card opens a detailed case study."
            action={
              <RouterButton to={ROUTES.portfolio} variant="text" endIcon={<ArrowForwardRoundedIcon />}>
                Full portfolio
              </RouterButton>
            }
          />
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            {PREVIEW_PORTFOLIO.slice(0, 3).map((item, index) => (
              <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                <ContentCard
                  title={item.title}
                  meta={item.category}
                  description={item.overview}
                  to={ROUTES.portfolioDetail(item.id)}
                  image={portfolioImages[index]}
                  imageAlt={`${item.title} visual`}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </PresentationSlide>

      <PresentationSlide id="slide-talent" delayMs={40}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ ...sectionPanel, height: '100%' }}>
              <SectionHeader
                eyebrow="Careers"
                title="Open roles"
                subtitle="Each listing links to a full job detail and application flow."
                action={
                  <RouterButton
                    to={ROUTES.jobs}
                    variant="text"
                    size="small"
                    endIcon={<ArrowForwardRoundedIcon />}
                  >
                    View all
                  </RouterButton>
                }
              />
              <Stack spacing={1.5} sx={{ mt: 0.5 }}>
                {PREVIEW_JOBS.slice(0, 3).map((job) => (
                  <ContentCard
                    key={job.id}
                    title={job.title}
                    meta={`${job.jobType} · ${job.location}`}
                    description={`Experience: ${job.experience}`}
                    to={ROUTES.jobDetail(job.id)}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ ...sectionPanel, height: '100%' }}>
              <SectionHeader
                eyebrow="Internships"
                title="Programs for emerging talent"
                subtitle="Structured paths for students and early-career professionals."
                action={
                  <RouterButton
                    to={ROUTES.internships}
                    variant="text"
                    size="small"
                    endIcon={<ArrowForwardRoundedIcon />}
                  >
                    View all
                  </RouterButton>
                }
              />
              <Stack spacing={1.5} sx={{ mt: 0.5 }}>
                {PREVIEW_INTERNSHIPS.slice(0, 3).map((item) => (
                  <ContentCard
                    key={item.id}
                    title={item.role}
                    meta={`${item.domain} · ${item.duration} · ${item.mode}`}
                    description={item.summary}
                    to={ROUTES.internshipDetail(item.id)}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </PresentationSlide>

      <PresentationSlide id="slide-insights" delayMs={40}>
        <Box
          sx={{
            ...sectionPanel,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' },
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={siteImages.digital}
            alt="Abstract digital technology visual"
            sx={{
              width: '100%',
              height: { xs: 220, md: 300 },
              objectFit: 'cover',
              borderRadius: 2.5,
            }}
          />
          <Box>
            <SectionHeader
              eyebrow="Insights"
              title="From the blog"
              subtitle="Practical perspectives since our launch."
              action={
                <RouterButton
                  to={ROUTES.blog}
                  variant="text"
                  size="small"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  All posts
                </RouterButton>
              }
            />
            <Stack spacing={1.5} sx={{ mt: 0.5 }}>
              {getPreviewBlogs()
                .slice(0, 2)
                .map((post) => (
                  <ContentCard
                    key={post.slug}
                    title={post.title}
                    meta={`${post.category} · ${post.date}`}
                    description={post.excerpt}
                    to={ROUTES.blogDetail(post.slug)}
                  />
                ))}
            </Stack>
          </Box>
        </Box>
      </PresentationSlide>

      <PresentationSlide id="slide-cta" delayMs={40}>
        <CTASection
          title="Start your project"
          description="Tell us what you need — technology, talent, training, or growth support."
          primaryLabel="Start Your Project"
          primaryTo={ROUTES.quote}
          secondaryLabel="Contact Us"
          secondaryTo={ROUTES.contact}
        />
      </PresentationSlide>
    </PageContainer>
  );
}
