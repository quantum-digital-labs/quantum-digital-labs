import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';

export interface AboutValueItem {
  title: string;
  description: string;
  accent: string;
}

const DEFAULT_VALUES: readonly AboutValueItem[] = [
  {
    title: 'Integrity',
    description: 'Honesty in every engagement and commitment.',
    accent: '#B8956B',
  },
  {
    title: 'Quality',
    description: 'Craft over shortcuts — built to last.',
    accent: '#2E5A8C',
  },
  {
    title: 'Practical',
    description: 'Learning and delivery grounded in real work.',
    accent: '#0C2340',
  },
  {
    title: 'Clarity',
    description: 'Transparent communication at every step.',
    accent: '#4A7AB0',
  },
  {
    title: 'Growth',
    description: 'Continuous improvement for people and products.',
    accent: '#96784F',
  },
] as const;

const NODE_SIZE = { xs: 108, md: 124 };

interface AboutValuesSectionProps {
  values?: readonly AboutValueItem[];
}

/**
 * Connected circular values chain with glance-up reveal on scroll.
 */
export function AboutValuesSection({ values = DEFAULT_VALUES }: AboutValuesSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} component="section" sx={{ position: 'relative', width: '100%' }}>
      <SectionHeader
        eyebrow="Culture"
        title="Values"
        subtitle="Principles that connect how we invent, deliver, and partner — one linked path."
      />

      <Box
        sx={{
          position: 'relative',
          mt: { xs: 3, md: 4.5 },
          px: { xs: 0.5, md: 1 },
        }}
      >
        {/* Horizontal connector (desktop) */}
        <Box
          aria-hidden
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: `calc(${NODE_SIZE.md}px / 2)`,
            left: '8%',
            right: '8%',
            height: 3,
            borderRadius: 2,
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.accent.main}, ${theme.palette.primary.main}, ${theme.palette.accent.light})`,
            transform: visible ? 'scaleX(1)' : 'scaleX(0.15)',
            transformOrigin: 'left center',
            opacity: visible ? 0.45 : 0,
            transition:
              'transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, opacity 0.6s ease 0.1s',
          }}
        />

        {/* Vertical connector (mobile) */}
        <Box
          aria-hidden
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            top: 24,
            bottom: 24,
            left: `calc(${NODE_SIZE.xs}px / 2 + 4px)`,
            width: 3,
            borderRadius: 2,
            background: (theme) =>
              `linear-gradient(180deg, ${theme.palette.accent.main}, ${theme.palette.primary.main})`,
            transform: visible ? 'scaleY(1)' : 'scaleY(0.12)',
            transformOrigin: 'top center',
            opacity: visible ? 0.4 : 0,
            transition:
              'transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, opacity 0.6s ease 0.1s',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-start' },
            justifyContent: { md: 'space-between' },
            gap: { xs: 3.5, md: 1.5 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          {values.map((item, index) => (
            <ValueNode
              key={item.title}
              item={item}
              index={index}
              visible={visible}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ValueNode({
  item,
  index,
  visible,
}: {
  item: AboutValueItem;
  index: number;
  visible: boolean;
}) {
  const delay = 120 + index * 110;

  return (
    <Stack
      spacing={1.5}
      sx={{
        width: { xs: '100%', md: `${100 / 5}%` },
        maxWidth: { md: 180 },
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'row', md: 'column' },
        gap: { xs: 2, md: 0 },
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.88)',
        filter: visible ? 'blur(0)' : 'blur(3px)',
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
          transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
          filter 0.65s ease ${delay}ms`,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: NODE_SIZE,
          height: NODE_SIZE,
          flexShrink: 0,
        }}
      >
        {/* Soft outer glow ring */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '1.5px dashed',
            borderColor: item.accent,
            opacity: visible ? 0.35 : 0,
            transition: `opacity 0.6s ease ${delay + 80}ms`,
            animation: visible ? 'qdl-value-orbit 12s linear infinite' : 'none',
          }}
        />
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            px: 1.25,
            bgcolor: 'background.paper',
            border: '3px solid',
            borderColor: item.accent,
            boxShadow: `0 10px 28px ${item.accent}33, inset 0 1px 0 rgba(255,255,255,0.7)`,
            backgroundImage: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), transparent 55%),
              linear-gradient(160deg, rgba(255,255,255,0.98), ${item.accent}14)`,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
              transform: 'translateY(-3px) scale(1.03)',
              boxShadow: `0 16px 36px ${item.accent}44`,
            },
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: item.accent,
                fontWeight: 700,
                letterSpacing: '0.08em',
                mb: 0.35,
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'primary.main',
                fontSize: { xs: '0.8125rem', md: '0.875rem' },
              }}
            >
              {item.title}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: { xs: 'left', md: 'center' },
          lineHeight: 1.55,
          maxWidth: { xs: 240, md: 160 },
          pt: { md: 0.5 },
        }}
      >
        {item.description}
      </Typography>
    </Stack>
  );
}
