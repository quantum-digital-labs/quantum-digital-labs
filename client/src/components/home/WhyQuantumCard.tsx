import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { WhyQuantumItem, WhyQuantumShape } from '../../data/whyQuantum';

const CLIP_PATHS: Record<WhyQuantumShape, string> = {
  circle: 'circle(50% at 50% 50%)',
  'soft-square': 'inset(0 round 22%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  hex: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
  blob: 'polygon(42% 4%, 78% 12%, 96% 42%, 88% 78%, 54% 98%, 18% 86%, 4% 52%, 14% 18%)',
  arch: 'ellipse(48% 50% at 50% 50%)',
};

const FRAME_SIZE = { xs: 72, sm: 80, md: 88 } as const;

interface WhyQuantumCardProps {
  item: WhyQuantumItem;
  index: number;
}

export function WhyQuantumCard({ item, index }: WhyQuantumCardProps) {
  const clip = CLIP_PATHS[item.shape];
  const odd = index % 2 === 1;

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        p: { xs: 1.75, md: 2 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 14px 32px rgba(12, 35, 64, 0.1)',
          borderColor: 'rgba(184, 149, 107, 0.4)',
        },
      }}
    >
      {/* Decorative corner shape */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 56,
          height: 56,
          top: odd ? 'auto' : -10,
          bottom: odd ? -10 : 'auto',
          right: odd ? -8 : 'auto',
          left: odd ? 'auto' : -8,
          borderRadius: item.shape === 'circle' ? '50%' : item.shape === 'diamond' ? 0 : 3,
          transform: item.shape === 'diamond' ? 'rotate(45deg)' : 'none',
          bgcolor: item.accent,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.75}
        sx={{ alignItems: { sm: 'center' }, position: 'relative', zIndex: 1 }}
      >
        <Box
          sx={{
            position: 'relative',
            width: FRAME_SIZE,
            height: FRAME_SIZE,
            flexShrink: 0,
            mx: { xs: 'auto', sm: 0 },
          }}
        >
          {/* Outer accent ring / frame */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: -5,
              clipPath: clip,
              background: `linear-gradient(145deg, ${item.accent}, rgba(255,255,255,0.35))`,
              opacity: 0.55,
            }}
          />
          {/* Soft glow */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 4,
              clipPath: clip,
              bgcolor: item.accent,
              opacity: 0.18,
              filter: 'blur(6px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              clipPath: clip,
              overflow: 'hidden',
              boxShadow: `0 8px 20px ${item.accent}33`,
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.imageAlt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: item.shape === 'diamond' ? 'scale(1.25)' : 'scale(1.05)',
              }}
            />
          </Box>
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: -2,
              right: item.shape === 'diamond' ? '38%' : -2,
              minWidth: 22,
              height: 22,
              px: 0.5,
              borderRadius: item.shape === 'hex' ? 0.75 : '50%',
              bgcolor: item.accent,
              color: 'common.white',
              display: 'grid',
              placeItems: 'center',
              fontSize: '0.65rem',
              fontWeight: 700,
              border: '2px solid',
              borderColor: 'background.paper',
              zIndex: 2,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </Box>
        </Box>

        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, minWidth: 0, flex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: item.accent, letterSpacing: '0.1em', display: 'block', mb: 0.35 }}
          >
            Pillar {String(index + 1).padStart(2, '0')}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {item.description}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
