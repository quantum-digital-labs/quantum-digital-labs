import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface PresentationSlideProps {
  children: ReactNode;
  /** Delay before the glance-up starts (ms). */
  delayMs?: number;
  /** Extra styles for the outer slide shell. */
  sx?: object;
  /** When true, content sits in a max-width container with padding. */
  contained?: boolean;
  id?: string;
}

/**
 * Presentation-style section: stays hidden until scrolled into view,
 * then glances up like a slide entering the stage.
 */
export function PresentationSlide({
  children,
  delayMs = 0,
  sx,
  contained = true,
  id,
}: PresentationSlideProps) {
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
    <Box
      ref={ref}
      id={id}
      component="section"
      className={visible ? 'qdl-slide-visible' : 'qdl-slide-hidden'}
      sx={{
        position: 'relative',
        width: '100%',
        py: 0,
        px: contained ? { xs: 2, sm: 3 } : 0,
        ...sx,
      }}
    >
      <Box
        sx={{
          maxWidth: contained ? 1200 : 'none',
          mx: contained ? 'auto' : 0,
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.985)',
          filter: visible ? 'blur(0)' : 'blur(2px)',
          transition: `opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms,
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms,
            filter 0.7s ease ${delayMs}ms`,
          willChange: 'opacity, transform',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
