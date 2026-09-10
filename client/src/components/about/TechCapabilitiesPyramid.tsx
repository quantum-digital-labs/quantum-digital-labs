import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { siteImages } from '../../assets/images';
import { SectionHeader } from '../common/SectionHeader';

export interface TechCapabilityItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  accent: string;
}

const TECH_CAPABILITIES: readonly TechCapabilityItem[] = [
  {
    id: 'engineering',
    title: 'Web & apps',
    summary: 'Web, mobile, and software that can be maintained.',
    image: siteImages.serviceIt,
    imageAlt: 'Software engineering workspace',
    accent: '#0C2340',
  },
  {
    id: 'design',
    title: 'UI / UX',
    summary: 'Research-led interfaces for real operators.',
    image: siteImages.projectCorporateWeb,
    imageAlt: 'Product design and interface craft',
    accent: '#B8956B',
  },
  {
    id: 'cloud',
    title: 'Cloud & AI',
    summary: 'Cloud operations, automation, and AI assists.',
    image: siteImages.projectCloud,
    imageAlt: 'Cloud infrastructure and automation',
    accent: '#2E5A8C',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    summary: 'SEO, campaigns, content, and measurement.',
    image: siteImages.serviceMarketing,
    imageAlt: 'Digital marketing operations',
    accent: '#96784F',
  },
  {
    id: 'staffing',
    title: 'Recruitment',
    summary: 'Contract, permanent, and bulk hiring workflows.',
    image: siteImages.projectRecruitment,
    imageAlt: 'Recruitment and staffing session',
    accent: '#4A7AB0',
  },
  {
    id: 'training',
    title: 'Training',
    summary: 'Cohorts, internships, and hands-on programs.',
    image: siteImages.serviceTraining,
    imageAlt: 'Professional training delivery',
    accent: '#1A3D66',
  },
] as const;

/**
 * Technology capabilities as a grid of square image boxes with glance-up motion.
 */
export function TechCapabilitiesPyramid() {
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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} component="section" sx={{ position: 'relative', width: '100%' }}>
      <SectionHeader
        eyebrow="Capabilities"
        title="Technology capabilities"
        subtitle="Six practice areas we staff and deliver against — engineering, design, cloud, marketing, recruitment, and training."
      />

      <Box
        sx={{
          position: 'relative',
          mt: { xs: 2, md: 2.5 },
          display: 'grid',
          gap: { xs: 1.25, md: 1.5 },
          maxWidth: 720,
          mx: 'auto',
          width: '100%',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: 'repeat(3, 1fr)',
          },
        }}
      >
        {TECH_CAPABILITIES.map((item, index) => (
          <CapabilitySquare
            key={item.id}
            item={item}
            visible={visible}
            delayMs={100 + index * 90}
          />
        ))}
      </Box>
    </Box>
  );
}

function CapabilitySquare({
  item,
  visible,
  delayMs,
}: {
  item: TechCapabilityItem;
  visible: boolean;
  delayMs: number;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 118, sm: 128, md: 136 },
        width: '100%',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 14px rgba(12, 35, 64, 0.07)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
        filter: visible ? 'blur(0)' : 'blur(2px)',
        transition: `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms,
          transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms,
          filter 0.55s ease ${delayMs}ms,
          box-shadow 0.25s ease`,
        '&:hover': {
          boxShadow: `0 8px 20px ${item.accent}33`,
          borderColor: `${item.accent}66`,
        },
        '&:hover .qdl-cap-img': {
          transform: 'scale(1.06)',
        },
        '&:hover .qdl-cap-overlay': {
          background: `linear-gradient(180deg, transparent 15%, ${item.accent}EE 100%)`,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 3,
          height: '100%',
          bgcolor: item.accent,
          zIndex: 2,
        }}
      />

      <Box
        component="img"
        className="qdl-cap-img"
        src={item.image}
        alt={item.imageAlt}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.45s ease',
        }}
      />

      <Box
        className="qdl-cap-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(180deg, transparent 30%, rgba(7, 24, 40, 0.9) 100%)',
          transition: 'background 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: { xs: 1, md: 1.25 },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: 'common.white',
            fontWeight: 700,
            fontSize: { xs: '0.75rem', md: '0.8125rem' },
            lineHeight: 1.2,
            mb: 0.25,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.35,
            fontSize: '0.65rem',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {item.summary}
        </Typography>
      </Box>
    </Box>
  );
}
