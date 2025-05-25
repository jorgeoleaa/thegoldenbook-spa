import * as React from 'react';
import { useContext } from 'react';
import { UserContext as UserContext, CartContext } from '../states/contexts';
import { Link, useNavigate } from '@tanstack/react-router';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchIcon from '@mui/icons-material/Search';

const sections = [
  { label: 'Home', path: '/' },
  { label: 'Categories', path: '/categories', icon: <LibraryBooksIcon fontSize="small" /> },
  { label: 'New Releases', path: '/new-releases', icon: <NewReleasesIcon fontSize="small" /> },
  { label: 'Contact', path: '/contact', icon: <ContactMailIcon fontSize="small" /> },
];

const settings = ['My profile', 'My orders', 'Log out'];

const CartBadge = styled(Badge)`
  & .MuiBadge-badge {
    top: -8px;
    right: -6px;
  }
`;

function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const userContext = useContext(UserContext);
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  if (!userContext || !cartContext) {
    throw new Error("Contexts must be used within their respective providers.");
  }

  const [cart, setCart] = cartContext;
  const [authenticatedUser, setAuthenticatedUser] = userContext;

  function logout() {
    sessionStorage.removeItem("authenticatedUser");
    setAuthenticatedUser(null);
    setCart({});
    navigate({ to: '/' });
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1E1E1E' }}>
      <Container maxWidth="xl">
        <Toolbar>
          <img src="imgs/logo-removebg-preview.png" alt="Logo" style={{ height: 50, marginRight: 16 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            The Golden Book
          </Typography>

          {/* Sections for large screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {sections.map((section) => (
              <Button
                key={section.label}
                component={Link}
                to={section.path}
                startIcon={section.icon}
                sx={{ my: 2, color: 'white', display: 'flex' }}
              >
                {section.label}
              </Button>
            ))}
          </Box>

          {/* Search icon */}
          <IconButton component={Link} to="/bookSearch" sx={{ color: 'white', mr: 2 }}>
            <SearchIcon />
          </IconButton>

          {/* Shopping cart */}
          <IconButton onClick={
            authenticatedUser ? 
            () => navigate({ to: '/cart' })
            : () => navigate({ to: '/login' })
          } sx={{ color: 'white', mr: 2 }}>
            <CartBadge badgeContent={cart?.lineas?.length} color="primary">
              <ShoppingCartIcon />
            </CartBadge>
          </IconButton>

          {/* User menu */}
          {authenticatedUser ? (
            <Tooltip title="Settings">
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
          ) : (
            <Button component={Link} to="/login" variant="contained">Log in</Button>
          )}
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
            sx={{ mt: '45px' }}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => {
                setAnchorElUser(null);
                if (setting === 'Log out') {
                  logout(); 
                } else if (setting === 'My profile') {
                  navigate({ to: '/profile' }); 
                } else if (setting === 'My orders') {
                  navigate({ to: '/orders' });
                }
              }}>
                {setting === 'My profile' || setting === 'My orders' ? (
                  <Link
                    to={setting === 'My profile' ? '/profile' : '/orders'}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {setting}
                  </Link>
                ) : (
                  setting
                )}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
