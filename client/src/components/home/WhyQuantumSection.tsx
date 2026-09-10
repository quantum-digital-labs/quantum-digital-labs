import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { siteImages } from '../../assets/images';
import { WHY_QUANTUM_ITEMS } from '../../data/whyQuantum';
import { sectionPanel } from '../../theme/surfaces';
import { SectionHeader } from '../common/SectionHeader';
import { WhyQuantumCard } from './WhyQuantumCard';

export function WhyQuantumSection() {
  return (
    <Box
      component="section"
      sx={{
        ...sectionPanel,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ideate shapes */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 140, md: 220 },
            height: { xs: 140, md: 220 },
            top: { xs: -40, md: -60 },
            right: { xs: -30, md: 40 },
            borderRadius: '42% 58% 60% 40% / 45% 38% 62% 55%',
            background: 'linear-gradient(145deg, rgba(184,149,107,0.16), rgba(46,90,140,0.08))',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 90,
            height: 90,
            bottom: 40,
            left: { xs: -20, md: 24 },
            borderRadius: '50%',
            border: '2px dashed rgba(184, 149, 107, 0.35)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 48,
            height: 48,
            top: '42%',
            right: 18,
            transform: 'rotate(45deg)',
            border: '1.5px solid rgba(12, 35, 64, 0.12)',
            display: { xs: 'none', md: 'block' },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 16,
            height: 16,
            top: 88,
            left: '48%',
            borderRadius: '50%',
            bgcolor: 'accent.main',
            opacity: 0.35,
            display: { xs: 'none', md: 'block' },
          }}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
            alignItems: 'center',
            mb: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: { md: 420 } }}>
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                width: { xs: 72, md: 96 },
                height: { xs: 72, md: 96 },
                top: { xs: -12, md: -16 },
                left: { xs: -8, md: -14 },
                borderRadius: '40% 60% 55% 45% / 50% 40% 60% 50%',
                bgcolor: 'accent.main',
                opacity: 0.18,
                zIndex: 0,
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                bottom: { xs: -10, md: -14 },
                right: { xs: 12, md: 28 },
                clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
                bgcolor: 'primary.main',
                opacity: 0.14,
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '28% 48% 36% 52% / 42% 30% 58% 44%',
                overflow: 'hidden',
                border: '3px solid',
                borderColor: 'background.paper',
                boxShadow: '0 18px 40px rgba(12, 35, 64, 0.16)',
                height: { xs: 220, md: 280 },
              }}
            >
              <Box
                component="img"
                src={siteImages.digital}
                alt="Ideation and creative strategy visual"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                zIndex: 2,
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                bgcolor: 'rgba(7, 24, 40, 0.78)',
                backdropFilter: 'blur(8px)',
                color: 'common.white',
                alignItems: 'center',
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'accent.light',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                Ideate · Build · Transform
              </Typography>
            </Stack>
          </Box>

          <Box>
            <SectionHeader
              eyebrow="Why Quantum"
              title="A partner focused on outcomes, not noise"
              subtitle="Six pillars that shape how we invent, deliver, and support — each framed with its own visual language."
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
          }}
        >
          {WHY_QUANTUM_ITEMS.map((item, index) => (
            <WhyQuantumCard key={item.id} item={item} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
