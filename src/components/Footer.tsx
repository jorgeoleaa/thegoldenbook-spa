import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'black', // Cambiado a negro
        color: 'white', // Texto en blanco para contrastar con el fondo negro
        py: 4,
        mt: 'auto', // Para que el footer se quede abajo si usas un layout flex
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sección de descripción */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              The Golden Book
            </Typography>
            <Typography variant="body2">
              Tu tienda de libros favorita. Encuentra los mejores títulos y autores.
            </Typography>
          </Grid>

          {/* Sección de enlaces rápidos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Link href="/" color="inherit" display="block" underline="hover">
              Inicio
            </Link>
            <Link href="/libros" color="inherit" display="block" underline="hover">
              Libros
            </Link>
            <Link href="/ofertas" color="inherit" display="block" underline="hover">
              Ofertas
            </Link>
            <Link href="/contacto" color="inherit" display="block" underline="hover">
              Contacto
            </Link>
          </Grid>

          {/* Sección de contacto */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: info@thegoldenbook.com
            </Typography>
            <Typography variant="body2" gutterBottom>
              Teléfono: +123 456 789
            </Typography>
          </Grid>

          {/* Sección de redes sociales */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Síguenos
            </Typography>
            <Link
              href="https://facebook.com/thegoldenbook"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              display="block"
              underline="hover"
            >
              Facebook
            </Link>
            <Link
              href="https://twitter.com/thegoldenbook"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              display="block"
              underline="hover"
            >
              Twitter
            </Link>
            <Link
              href="https://instagram.com/thegoldenbook"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              display="block"
              underline="hover"
            >
              Instagram
            </Link>
          </Grid>
        </Grid>

        {/* Pie de página */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2,
            mt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} The Golden Book. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;