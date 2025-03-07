import { createLazyFileRoute } from '@tanstack/react-router';
import { Avatar, Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ClienteContext } from '../states/contexts';
import { useContext } from 'react';

export const Route = createLazyFileRoute('/profile')({
  component: Profile,
});

function Profile() {
  const clienteContext = useContext(ClienteContext);

  if (!clienteContext) {
    throw new Error("ClienteContext debe usarse dentro de un ClienteProvider");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clienteAutenticado, setClienteAutenticado] = clienteContext;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
      <Card sx={{ maxWidth: 500, width: '100%', p: 3, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {/* Perfil de Usuario */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 80, height: 80, mb: 2 }} src="/profile-pic.jpg" alt="User Profile" />
            <Typography variant="h5" fontWeight="bold">
              {clienteAutenticado?.nombre} {clienteAutenticado?.apellido1} {clienteAutenticado?.apellido2}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {clienteAutenticado?.email}
            </Typography>
          </Box>

          {/* Información del Usuario */}
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">Username:</Typography>
              <Typography variant="body2" color="text.secondary">{clienteAutenticado?.nickname}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">DNI/NIE:</Typography>
              <Typography variant="body2" color="text.secondary">{clienteAutenticado?.dniNie}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">Phone:</Typography>
              <Typography variant="body2" color="text.secondary">{clienteAutenticado?.telefono}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">Address:</Typography>
              {/* Mostrar las direcciones */}
              {clienteAutenticado?.direcciones && clienteAutenticado.direcciones.length > 0 ? (
                clienteAutenticado.direcciones.map((direccion, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    No hay datos de la dirección
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No address available</Typography>
              )}
            </Grid>
          </Grid>

          {/* Botón para editar */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" startIcon={<EditIcon />} sx={{ borderRadius: 2 }}>
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
