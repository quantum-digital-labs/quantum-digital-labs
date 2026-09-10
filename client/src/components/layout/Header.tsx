import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY, HEADER_NAV, ROUTES } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearCredentials } from '../../store/slices/authSlice';
import { clearSession } from '../../utils/authStorage';
import { BrandLogo } from '../common/BrandLogo';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { RouterButton } from '../common/RouterButton';

const DRAWER_WIDTH = 300;

const navLinkSx = {
  px: 1.25,
  py: 0.85,
  borderRadius: 1.5,
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.secondary',
  textDecoration: 'none',
  position: 'relative',
  transition: 'color 0.2s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 4,
    height: 2,
    borderRadius: 1,
    bgcolor: 'accent.main',
    transform: 'scaleX(0)',
    transition: 'transform 0.22s ease',
  },
  '&.active': {
    color: 'primary.main',
    '&::after': {
      transform: 'scaleX(1)',
    },
  },
  '&:hover': {
    color: 'primary.main',
  },
} as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isStaff = user?.role === 'admin' || user?.role === 'editor';

  const closeDrawer = () => setMobileOpen(false);
  const toggleDrawer = () => setMobileOpen((open) => !open);

  const requestSignOut = () => {
    closeDrawer();
    setSignOutOpen(true);
  };

  const handleSignOut = () => {
    setSignOutOpen(false);
    clearSession();
    dispatch(clearCredentials());
    navigate(ROUTES.home);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(250, 250, 248, 0.88)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(16px) saturate(1.2)',
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: { xs: 72, md: 80 }, py: 0.75 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open navigation menu"
            onClick={toggleDrawer}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <BrandLogo size="md" variant="light" sx={{ mr: { md: 2 }, flexGrow: { xs: 1, md: 0 } }} />

          <Box
            component="nav"
            aria-label="Primary"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              flexGrow: 1,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {HEADER_NAV.map((item) => (
              <Typography
                key={item.path}
                component={NavLink}
                to={item.path}
                variant="body2"
                sx={navLinkSx}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}
          >
            {isAuthenticated ? (
              <>
                {isStaff ? (
                  <RouterButton to={ROUTES.admin} variant="outlined" size="small">
                    Admin
                  </RouterButton>
                ) : null}
                <RouterButton
                  to={ROUTES.jobsApplied}
                  variant="outlined"
                  size="small"
                >
                  My jobs
                </RouterButton>
                <RouterButton
                  to={ROUTES.internshipsApplied}
                  variant="outlined"
                  size="small"
                >
                  My internships
                </RouterButton>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: 'text.secondary', maxWidth: 120 }}
                  noWrap
                  title={user?.email ?? user?.name}
                >
                  {user?.name || user?.email}
                </Typography>
                <Button variant="outlined" size="small" onClick={requestSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <RouterButton to={ROUTES.login} variant="outlined" size="small">
                Sign in
              </RouterButton>
            )}
            <RouterButton
              to={ROUTES.quote}
              variant="contained"
              size="small"
              sx={{
                bgcolor: 'primary.main',
                px: 2,
                '&:hover': { bgcolor: 'primary.light' },
              }}
            >
              Get a Quote
            </RouterButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: 'background.elevated',
          },
        }}
      >
        <Box
          role="navigation"
          aria-label="Mobile"
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Stack
            direction="row"
            sx={{
              px: 2,
              py: 1.5,
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <BrandLogo size="sm" variant="light" />
            <IconButton aria-label="Close navigation menu" onClick={closeDrawer}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <List sx={{ flexGrow: 1 }}>
            {HEADER_NAV.map((item) => {
              const selected = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  selected={selected}
                  onClick={closeDrawer}
                  sx={{
                    '&.Mui-selected': {
                      borderLeft: '3px solid',
                      borderColor: 'accent.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
            {isStaff ? (
              <ListItemButton
                component={RouterLink}
                to={ROUTES.admin}
                selected={location.pathname.startsWith(ROUTES.admin)}
                onClick={closeDrawer}
                sx={{
                  '&.Mui-selected': {
                    borderLeft: '3px solid',
                    borderColor: 'accent.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemText primary="Admin" />
              </ListItemButton>
            ) : null}
            {isAuthenticated ? (
              <>
                <ListItemButton
                  component={RouterLink}
                  to={ROUTES.jobsApplied}
                  selected={location.pathname.startsWith(ROUTES.jobsApplied)}
                  onClick={closeDrawer}
                >
                  <ListItemText primary="My applied jobs" />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to={ROUTES.internshipsApplied}
                  selected={location.pathname.startsWith(ROUTES.internshipsApplied)}
                  onClick={closeDrawer}
                >
                  <ListItemText primary="My applied internships" />
                </ListItemButton>
                <ListItemButton onClick={requestSignOut}>
                  <ListItemText primary={`Sign out (${user?.name ?? 'Account'})`} />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton
                component={RouterLink}
                to={ROUTES.login}
                selected={location.pathname === ROUTES.login}
                onClick={closeDrawer}
              >
                <ListItemText primary="Sign in" />
              </ListItemButton>
            )}
          </List>
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              {COMPANY.tagline}
            </Typography>
            {!isAuthenticated ? (
              <Stack spacing={1}>
                <RouterButton
                  to={ROUTES.login}
                  variant="outlined"
                  fullWidth
                  onClick={closeDrawer}
                >
                  Sign in to track applications
                </RouterButton>
                <RouterButton to={ROUTES.quote} variant="contained" fullWidth onClick={closeDrawer}>
                  Get a Quote
                </RouterButton>
              </Stack>
            ) : (
              <RouterButton to={ROUTES.quote} variant="contained" fullWidth onClick={closeDrawer}>
                Get a Quote
              </RouterButton>
            )}
          </Box>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={signOutOpen}
        title="Sign out?"
        message="You will need to sign in again to access your account."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        confirmColor="error"
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
    </>
  );
}
