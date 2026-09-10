import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  /** When false, content spans full width (used for full-bleed heroes). */
  contained?: boolean;
}

export function PageContainer({ children, contained = true }: PageContainerProps) {
  const content = (
    <Box
      component="section"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: contained ? { xs: 4, md: 5 } : 0,
      }}
    >
      {children}
    </Box>
  );

  if (!contained) {
    return content;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {content}
    </Container>
  );
}
