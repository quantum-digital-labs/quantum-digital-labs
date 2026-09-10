import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ROUTES } from '../constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearCredentials } from '../store/slices/authSlice';
import { clearSession } from '../utils/authStorage';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.admin },
  { label: 'Services', path: ROUTES.adminServices },
  { label: 'Jobs', path: ROUTES.adminJobs },
  { label: 'Internships', path: ROUTES.adminInternships },
  { label: 'Projects', path: ROUTES.adminProjects },
  { label: 'Portfolio', path: ROUTES.adminPortfolio },
  { label: 'Blog', path: ROUTES.adminBlog },
  { label: 'About', path: ROUTES.adminAbout },
  { label: 'Applications', path: ROUTES.adminApplications },
] as const;

function navSelected(pathname: string, itemPath: string): boolean {
  if (itemPath === ROUTES.admin) {
    return pathname === ROUTES.admin || pathname === `${ROUTES.admin}/`;
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleSignOut = () => {
    setSignOutOpen(false);
    clearSession();
    dispatch(clearCredentials());
    navigate(ROUTES.adminLogin);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography
          component={RouterLink}
          to={ROUTES.admin}
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            textDecoration: 'none',
            letterSpacing: 0.2,
          }}
        >
          QDL Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1, py: 1.5 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === ROUTES.admin}
            onClick={() => setMobileOpen(false)}
            selected={navSelected(location.pathname, item.path)}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.hover',
                borderLeft: '3px solid',
                borderColor: 'accent.main',
              },
            }}
          >
            {item.path === ROUTES.admin ? (
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DashboardRoundedIcon fontSize="small" />
              </ListItemIcon>
            ) : null}
            <ListItemText
              primary={
                <Typography component="span" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ display: 'block' }}
        >
          {user?.email}
        </Typography>
        <Button
          component={RouterLink}
          to={ROUTES.home}
          size="small"
          sx={{ mt: 1, fontWeight: 600 }}
        >
          View site
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'rgba(250, 250, 248, 0.92)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar sx={{ gap: 1.5, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
              aria-label="Open admin menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Content CMS
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutRoundedIcon />}
            onClick={() => setSignOutOpen(true)}
          >
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.elevated',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
          <Outlet />
        </Box>
      </Box>

      <ConfirmDialog
        open={signOutOpen}
        title="Sign out?"
        message="You will leave the admin CMS until you sign in again."
        confirmLabel="Sign out"
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
    </Box>
  );
}
