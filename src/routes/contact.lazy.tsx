import { Box, Container, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const Route = createLazyFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Mensaje enviado:", formData);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Contacto
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          ¿Tienes alguna pregunta? Contáctanos a través del formulario o visítanos en nuestra dirección.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Mensaje"
                name="message"
                value={formData.message}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Enviar Mensaje
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Nuestra dirección</Typography>
            <Typography variant="body2">Rúa do Comercio, 20, 27400 Monforte de Lemos, Lugo</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Teléfono</Typography>
            <Typography variant="body2">+123 456 789</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Correo</Typography>
            <Typography variant="body2">info@thegoldenbook.com</Typography>
            <Box sx={{ mt: 2, mb: 2, pb: 2 } }>
              <iframe
                title="Mapa de ubicación"
                width="100%"
                height="250"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5881.07044846226!2d-7.516364723408093!3d42.52268402481133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3013e881be79d1%3A0xc09c016337705dcc!2sLibrer%C3%ADa%20Papelotes!5e0!3m2!1ses!2ses!4v1741736830867!5m2!1ses!2ses"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
