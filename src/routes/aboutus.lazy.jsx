import { createLazyFileRoute } from '@tanstack/react-router';
import { Container, Typography, Box, Paper } from '@mui/material';

export const Route = createLazyFileRoute('/aboutus')({
  component: AboutUs,
});

function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sobre Nosotros
        </Typography>
        <Typography variant="body1" paragraph>
          Bienvenido a The Golden Book. Somos una librería dedicada a ofrecer una amplia selección de libros para todos los gustos y edades. Nuestra misión es fomentar la lectura y proporcionar un espacio donde los amantes de los libros puedan encontrar sus próximas lecturas favoritas.
        </Typography>
        <Typography variant="body1" paragraph>
          En The Golden Book, creemos que los libros tienen el poder de cambiar vidas. Por eso, nos esforzamos por ofrecer una experiencia de compra única y personalizada, con un equipo de expertos siempre dispuesto a ayudarte a encontrar el libro perfecto.
        </Typography>
        <Typography variant="body1" paragraph>
          Nuestra librería cuenta con una gran variedad de géneros, desde ficción y no ficción hasta libros infantiles y juveniles. También ofrecemos una selección de libros en varios idiomas para satisfacer las necesidades de nuestra diversa comunidad de lectores.
        </Typography>
        <Typography variant="body1" paragraph>
          Gracias por visitarnos y esperamos que disfrutes de tu experiencia en The Golden Book. Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros.
        </Typography>
      </Paper>
    </Container>
  );
}
