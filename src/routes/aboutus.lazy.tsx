import { createLazyFileRoute } from '@tanstack/react-router';
import { Container, Typography, Paper } from '@mui/material';

export const Route = createLazyFileRoute('/aboutus')({
  component: AboutUs,
});

function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About us
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to The Golden Book. We are a bookstore dedicated to offering a wide selection of books for all tastes and ages. Our mission is to promote reading and provide a space where book lovers can find their next favorite reads.
        </Typography>
        <Typography variant="body1" paragraph>
          At The Golden Book, we believe that books have the power to change lives. That’s why we strive to offer a unique and personalized shopping experience, with a team of experts always ready to help you find the perfect book.
        </Typography>
        <Typography variant="body1" paragraph>
          Our bookstore features a wide variety of genres, from fiction and non-fiction to children's and young adult books. We also offer a selection of books in multiple languages to meet the needs of our diverse community of readers.          </Typography>
        <Typography variant="body1" paragraph>
          Thank you for visiting us, and we hope you enjoy your experience at The Golden Book. If you have any questions or need assistance, feel free to reach out to us.        </Typography>
      </Paper>
    </Container>
  );
}
