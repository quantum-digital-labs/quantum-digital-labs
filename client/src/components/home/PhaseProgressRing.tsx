import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { ProcessMethodPhase } from '../../data/processMethod';

interface PhaseProgressRingProps {
  phase: ProcessMethodPhase;
  stepIndex: number;
  active: boolean;
  onSelect: () => void;
  size?: number;
}

export function PhaseProgressRing({
  phase,
  stepIndex,
  active,
  onSelect,
  size = 108,
}: PhaseProgressRingProps) {
  const inset = 10;
  const imageSize = size - inset * 2 - 8;

  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${phase.title}: ${phase.tagline}. Step ${stepIndex + 1} of 6.`}
      sx={{
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.25,
        minWidth: size + 8,
        color: 'inherit',
        transition: 'transform 0.25s ease',
        transform: active ? 'translateY(-4px)' : 'none',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'accent.main',
          outlineOffset: 4,
          borderRadius: 2,
        },
      }}
    >
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={2.5}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            color: 'divider',
            opacity: 0.55,
          }}
        />
        <CircularProgress
          variant="determinate"
          value={phase.progress}
          size={size}
          thickness={2.5}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            color: active ? 'accent.main' : 'primary.main',
            transition: 'color 0.25s ease',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: inset,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: active ? 'accent.light' : 'background.paper',
            boxShadow: active
              ? '0 8px 24px rgba(184, 149, 107, 0.28)'
              : '0 4px 14px rgba(12, 35, 64, 0.12)',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          <Box
            component="img"
            src={phase.image}
            alt={phase.imageAlt}
            sx={{
              width: imageSize,
              height: imageSize,
              objectFit: 'cover',
              display: 'block',
              filter: active ? 'none' : 'saturate(0.85)',
              transition: 'filter 0.25s ease',
            }}
          />
        </Box>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 26,
            height: 26,
            px: 0.75,
            borderRadius: '50%',
            bgcolor: active ? 'accent.main' : 'primary.main',
            color: 'common.white',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.6875rem',
            fontWeight: 700,
            border: '2px solid',
            borderColor: 'background.paper',
            transition: 'background-color 0.25s ease',
          }}
        >
          {String(stepIndex + 1).padStart(2, '0')}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', maxWidth: size + 24 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: active ? 'primary.main' : 'text.primary',
            transition: 'color 0.2s ease',
          }}
        >
          {phase.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
          {phase.progress}%
        </Typography>
      </Box>
    </Box>
  );
}
