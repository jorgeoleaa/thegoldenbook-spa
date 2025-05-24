import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'black',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Description section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              The Golden Book
            </Typography>
            <Typography variant="body2">
              Your favorite bookstore. Find the best titles and authors.
            </Typography>
          </Grid>

          {/* Quick links section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" underline="hover">
              Home
            </Link>
            <Link href="/books" color="inherit" display="block" underline="hover">
              Books
            </Link>
            <Link href="/deals" color="inherit" display="block" underline="hover">
              Deals
            </Link>
            <Link href="/contact" color="inherit" display="block" underline="hover">
              Contact
            </Link>
          </Grid>

          {/* Contact section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: info@thegoldenbook.com
            </Typography>
            <Typography variant="body2" gutterBottom>
              Phone number: +123 456 789
            </Typography>
          </Grid>

          {/* Social Media section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow us
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

        {/* Footer */}
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
            &copy; {new Date().getFullYear()} The Golden Book. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;