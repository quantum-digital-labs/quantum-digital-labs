import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { PROCESS_METHOD_PHASES } from '../../data/processMethod';
import { sectionPanel } from '../../theme/surfaces';
import { SectionHeader } from '../common/SectionHeader';
import { PhaseProgressRing } from './PhaseProgressRing';

export function ProcessMethodSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhase = PROCESS_METHOD_PHASES[activeIndex];

  return (
    <Box component="section" sx={sectionPanel}>
      <SectionHeader
        eyebrow="Method"
        title="From ideation to long-term support"
        subtitle="Six design phases — each with clear outcomes, visual progress, and deliverables you can track."
      />

      <Box
        sx={{
          position: 'relative',
          mt: 3,
          mb: 3,
          px: { xs: 0, md: 2 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'absolute',
            top: 54,
            left: '8%',
            right: '8%',
            height: 2,
            borderRadius: 1,
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.accent.main} 100%)`,
            opacity: 0.2,
          }}
        />

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, md: 1.5, lg: 2.5 },
            overflowX: 'auto',
            pb: 1,
            mx: { xs: -1, md: 0 },
            px: { xs: 1, md: 0 },
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            justifyContent: { md: 'space-between' },
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: 3,
            },
          }}
        >
          {PROCESS_METHOD_PHASES.map((phase, index) => (
            <Box key={phase.id} sx={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
              <PhaseProgressRing
                phase={phase}
                stepIndex={index}
                active={index === activeIndex}
                onSelect={() => setActiveIndex(index)}
                size={index === activeIndex ? 116 : 104}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        className="qdl-fade-up"
        key={activePhase.id}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.elevated',
          boxShadow: '0 12px 36px rgba(12, 35, 64, 0.08)',
        }}
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative', height: { xs: 240, md: '100%' }, minHeight: { md: 320 } }}>
              <Box
                component="img"
                src={activePhase.image}
                alt={activePhase.imageAlt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, transparent 35%, rgba(7, 24, 40, 0.75) 100%)',
                }}
              />
              <Stack
                spacing={0.5}
                sx={{
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  bottom: 20,
                  color: 'common.white',
                }}
              >
                <Typography variant="overline" sx={{ color: 'accent.light' }}>
                  Phase {String(activeIndex + 1).padStart(2, '0')} · {activePhase.duration}
                </Typography>
                <Typography variant="h4" sx={{ color: 'common.white' }}>
                  {activePhase.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.88 }}>
                  {activePhase.tagline}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
              <Box>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phase progress
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'accent.dark' }}>
                    {activePhase.progress}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={activePhase.progress}
                  aria-label={`${activePhase.title} phase progress`}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'divider',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: 'accent.main',
                    },
                  }}
                />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {activePhase.description}
              </Typography>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25 }}>
                  Key deliverables
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {activePhase.deliverables.map((item) => (
                    <Chip
                      key={item}
                      icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: '16px !important' }} />}
                      label={item}
                      variant="outlined"
                      sx={{
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: 'accent.main' },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: 'wrap', pt: 0.5, mt: 'auto' }}
              >
                {PROCESS_METHOD_PHASES.map((phase, index) => (
                  <Chip
                    key={phase.id}
                    label={phase.title}
                    size="small"
                    onClick={() => setActiveIndex(index)}
                    variant={index === activeIndex ? 'filled' : 'outlined'}
                    sx={{
                      fontWeight: 600,
                      cursor: 'pointer',
                      ...(index === activeIndex
                        ? { bgcolor: 'primary.main', color: 'common.white' }
                        : { borderColor: 'divider' }),
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
