import React from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Button,
  Stack,
  Container,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Home,
  ShoppingBag,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <ShoppingBag /> },
    ...(isAuthenticated
      ? [
          { label: 'Orders', path: '/orders', icon: <ShoppingBag /> },
          { label: 'Profile', path: '/profile', icon: <AccountCircle /> },
        ]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          ml: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, sm: 80 } }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 0.4 }}
          >
            NOVA LUXE
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: 'flex',
              mr: 2,
              flexWrap: 'nowrap',
              overflowX: 'auto',
              maxWidth: { xs: 180, sm: 'none' },
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color={isActive(item.path) ? 'secondary' : 'inherit'}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  fontWeight: 600,
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  bgcolor: isActive(item.path) ? 'rgba(30, 58, 95, 0.10)' : 'transparent',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {!isAuthenticated && (
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 1, display: { xs: 'none', md: 'inline-flex' } }}
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          )}
          {isAuthenticated ? (
            <IconButton color="inherit" onClick={logout}>
              <AccountCircle />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => navigate('/login')}>
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top right, rgba(212,175,55,0.08), transparent 45%), #fafafa',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Outlet />
        </Container>
        <Box
          component="footer"
          sx={{
            borderTop: '1px solid rgba(0,0,0,0.08)',
            mt: 6,
            py: 3,
            px: { xs: 2, md: 4 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Crafted for premium shopping experiences.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Nova Luxe
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;