import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
} from "@mui/material";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { AutenticarClienteRequest, DefaultApi } from "../services/proxy/generated/apis/DefaultApi";
import { ClienteCredentials } from "../services/proxy/generated/models";
import { ClienteContext } from "../states/contexts";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const api = new DefaultApi();

  const clienteContext = useContext(ClienteContext);

  if (!clienteContext) {
    throw new Error("ClienteContext debe usarse dentro de un ClienteProvider");
  }

  const [clienteAutenticado, setClienteAutenticado] = clienteContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    console.log(clienteAutenticado);

    try {
      const clienteCredentials: ClienteCredentials = {
        mail: email,
        password: password,
      };

      const autenticarClienteRequest: AutenticarClienteRequest = {
        clienteCredentials: clienteCredentials,
      };
      const usuarioAutenticado = await api.autenticarCliente(autenticarClienteRequest);
      setClienteAutenticado(usuarioAutenticado);
      console.log("Usuario autenticado:", usuarioAutenticado);
      navigate({ to: "/libroSearch" }); 
    } catch (err) {
      console.log(err);
      setError("Credenciales incorrectas. Inténtalo de nuevo. ");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src="../src/assets/imgs/logo.jpg"
            alt="logo thegoldenbook"
            style={{ height: 60 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            The Golden Book
          </Typography>
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Bienvenido
        </Typography>
        <Typography variant="body1" paragraph>
          Por favor, introduce los siguientes campos para iniciar sesión.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                name="rememberMe"
                color="primary"
              />
            }
            label="Recuérdame"
          />
          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Link href="#" variant="body2">
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Iniciar sesión
          </Button>
          <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }}>
            <img
              src="/ruta/icono-google.png"
              alt="Google Icono"
              style={{ height: 20, marginRight: 8 }}
            />
            Iniciar sesión con Google
          </Button>
        </form>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link href="/public/usuario/singup.jsp" variant="body2">
            ¿No tienes una cuenta? Regístrate
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
