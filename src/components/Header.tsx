import * as React from 'react';
import { useContext } from 'react';
import { ClienteContext, CartContext } from '../states/contexts';
import { Link, useNavigate } from '@tanstack/react-router';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchIcon from '@mui/icons-material/Search';

const sections = [
  { label: 'Inicio', path: '/' },
  { label: 'Categorías', path: '/categories', icon: <LibraryBooksIcon fontSize="small" /> },
  { label: 'Novedades', path: '/new-releases', icon: <NewReleasesIcon fontSize="small" /> },
  { label: 'Contacto', path: '/contact', icon: <ContactMailIcon fontSize="small" /> },
];

const settings = ['Mi perfil', 'Mis pedidos', 'Salir'];

const CartBadge = styled(Badge)`
  & .MuiBadge-badge {
    top: -8px;
    right: -6px;
  }
`;

function Header() {
  const clienteInSession = JSON.parse(sessionStorage.getItem('usuarioAutenticado') || 'null');
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const clienteContext = useContext(ClienteContext);
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  if (!clienteContext || !cartContext) {
    throw new Error("Los contextos deben usarse dentro de sus respectivos proveedores");
  }

  const [cart, setCart] = cartContext;

  function salir() {
    sessionStorage.removeItem("usuarioAutenticado");
    setCart({});
    navigate({ to: '/' });
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1E1E1E' }}>
      <Container maxWidth="xl">
        <Toolbar>
          <img src="../src/assets/imgs/logo-removebg-preview.png" alt="Logo" style={{ height: 50, marginRight: 16 }} />
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

          {/* Secciones para pantallas grandes */}
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

          {/* Ícono de búsqueda */}
          <IconButton component={Link} to="/libroSearch" sx={{ color: 'white', mr: 2 }}>
            <SearchIcon />
          </IconButton>

          {/* Carrito de compras */}
          <IconButton onClick={
            clienteInSession ? 
            () => navigate({ to: '/cart' })
            : () => navigate({to: '/login'})
            } sx={{ color: 'white', mr: 2 }}>
            <CartBadge badgeContent={cart?.lineas?.length} color="primary">
              <ShoppingCartIcon />
            </CartBadge>
          </IconButton>

          {/* Menú de usuario */}
          {clienteInSession ? (
            <Tooltip title="Configuración">
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
          ) : (
            <Button component={Link} to="/login" variant="contained">Iniciar Sesión</Button>
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
                if (setting === 'Salir') {
                  salir(); 
                } else if (setting === 'Mi perfil') {
                  navigate({to: '/profile'}); 
                } else if (setting === 'Mis pedidos') {
                  navigate({to: '/pedidos'});
                }
              }}>
                {setting === 'Mi perfil' || setting === 'Mis pedidos' ? (
                  <Link
                    to={setting === 'Mi perfil' ? '/profile' : '/pedidos'}
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
