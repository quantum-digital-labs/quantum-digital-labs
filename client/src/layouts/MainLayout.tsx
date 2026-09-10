import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ChatbotWidget, Footer, Header } from '../components';

interface MainLayoutProps {
  /** Optional when used as a nested route layout (renders Outlet). */
  children?: ReactNode;
}

/**
 * Global application shell with connected header and footer navigation.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children ?? <Outlet />}
      </Box>
      <Footer />
      <ChatbotWidget />
    </Box>
  );
}
