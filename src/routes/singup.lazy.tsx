import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Link,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { DefaultApi } from '../services/proxy/generated/apis/DefaultApi';
import { createLazyFileRoute } from "@tanstack/react-router";
import { ClienteDTO } from "../services/proxy/generated";

export const Route = createLazyFileRoute("/singup")({
  component: Signup,
});

function Signup() {
  const api = new DefaultApi();
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [nickname, setNickname] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jwt, setJwt] = useState("");

  const register = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!nombre || !nickname || !email || !password) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    try {
      const nuevoCliente: ClienteDTO = {
        nombre: nombre,
        nickname: nickname,
        apellido1: apellido1,
        apellido2: apellido2,
        email: email,
        password: password,
        telefono: telefono,
        dniNie: dni,
        jwt: undefined
      };

      const request = { clienteDTO: nuevoCliente };
      const clienteRegistrado = await api.registerCliente(request);

      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      sessionStorage.setItem("usuarioAutenticado", JSON.stringify(clienteRegistrado));
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (error) {
      setError("Error al registrar el cliente. Inténtalo de nuevo.");
      console.error("Error en el registro:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img src="../src/assets/imgs/logo.jpg" alt="logo thegoldenbook" style={{ height: 60 }} />
          <Typography variant="h4" gutterBottom>
            The Golden Book
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          Crea tu cuenta
        </Typography>
        <Typography variant="body1" paragraph>
          Por favor, introduce tus datos para registrarte.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" fullWidth required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nickname" fullWidth required value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido 1" fullWidth value={apellido1} onChange={(e) => setApellido1(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido 2" fullWidth value={apellido2} onChange={(e) => setApellido2(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="DNI" fullWidth value={dni} onChange={(e) => setDni(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" fullWidth value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Contraseña" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Confirmar Contraseña" type="password" fullWidth required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={register}>
            Registrarse
          </Button>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link href="/login" variant="body2">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
