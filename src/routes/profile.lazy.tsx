import { createLazyFileRoute } from '@tanstack/react-router';
import { Avatar, Box, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { ClienteDTO } from '../services/proxy/generated';

export const Route = createLazyFileRoute('/profile')({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<ClienteDTO | null>(null);

  const usuarioAutenticado: ClienteDTO | null = JSON.parse(sessionStorage.getItem('usuarioAutenticado') || 'null');

  useEffect(() => {
    if (!usuarioAutenticado) {
      console.log("No hay un usuario autenticado.");
      navigate({ to: "/login" });
    } else {
      console.log("Usuario autenticado:", usuarioAutenticado);
    }
  }, [usuarioAutenticado, navigate]);

  if (!usuarioAutenticado) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
        <Typography variant="h6" color="text.secondary">
          No hay un usuario autenticado. Por favor, inicia sesión.
        </Typography>
      </Box>
    );
  }

  const handleEditClick = () => {
    setEditedUser({ ...usuarioAutenticado });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedUser) {
      sessionStorage.setItem('usuarioAutenticado', JSON.stringify(editedUser));
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
      <Card sx={{ maxWidth: 500, width: '100%', p: 3, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {/* Perfil de Usuario */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 80, height: 80, mb: 2 }} src="/profile-pic.jpg" alt="User Profile" />
            {isEditing ? (
              <>
                <TextField name="nombre" value={editedUser?.nombre || ''} onChange={handleChange} margin="normal" />
                <TextField name="apellido1" value={editedUser?.apellido1 || ''} onChange={handleChange} margin="normal" />
                <TextField name="apellido2" value={editedUser?.apellido2 || ''} onChange={handleChange} margin="normal" />
              </>
            ) : (
              <Typography variant="h5" fontWeight="bold">
                {usuarioAutenticado.nombre} {usuarioAutenticado.apellido1} {usuarioAutenticado.apellido2}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {usuarioAutenticado.email}
            </Typography>
          </Box>

          {/* Información del Usuario */}
          <Box mt={3}>
            {[
              { label: 'Username', field: 'nickname' },
              { label: 'DNI/NIE', field: 'dniNie' },
              { label: 'Phone', field: 'telefono' },
              { label: 'Email', field: 'email' },
              { label: 'Contraseña', field: 'password', isPassword: true },
            ].map(({ label, field, isPassword }) => (
              <Box key={field} mb={2}>
                <Typography variant="body1" fontWeight="bold">{label}:</Typography>
                {isEditing ? (
                  <TextField
                    name={field}
                    value={editedUser?.[field as keyof ClienteDTO] ?? ''}
                    onChange={handleChange}
                    fullWidth
                    type={isPassword ? 'password' : 'text'}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {isPassword
                      ? String(usuarioAutenticado[field as keyof ClienteDTO]).replace(/./g, '*')
                      : String(usuarioAutenticado[field as keyof ClienteDTO])
                    }
                  </Typography>
                )}
              </Box>
            ))}

            <Box mb={2}>
              <Typography variant="body1" fontWeight="bold">Address:</Typography>
              {isEditing ? (
                <TextField
                  name="direcciones"
                  value={editedUser?.direcciones?.join(', ') || ''}
                  onChange={handleChange}
                  fullWidth
                />
              ) : (
                usuarioAutenticado.direcciones && Array.isArray(usuarioAutenticado.direcciones) && usuarioAutenticado.direcciones.length > 0 ? (
                  usuarioAutenticado.direcciones.map((direccion, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      {"No hay datos de la dirección"}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No address available</Typography>
                )
              )}
            </Box>
          </Box>


          {/* Botones de editar, guardar y cancelar */}
          <Box display="flex" justifyContent="center" mt={3}>
            {isEditing ? (
              <>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveClick} sx={{ borderRadius: 2, mr: 2 }}>
                  Guardar
                </Button>
                <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancelClick} sx={{ borderRadius: 2 }}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditClick} sx={{ borderRadius: 2 }}>
                Editar Perfil
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
