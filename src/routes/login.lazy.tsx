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
import { AutenticarClienteRequest, DefaultApi, FindPedidosByCriteriaRequest, RegisterClienteRequest, UpdateClienteRequest } from '../services/proxy/generated/apis/DefaultApi';
import { ClienteCredentials } from "../services/proxy/generated/models";
import { CartContext, ClienteContext } from "../states/contexts";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ClienteDTO } from "../services/proxy/generated/models";
import { FindClienteByEmailRequest } from "../services/proxy/generated/apis/DefaultApi";

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

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext debe usarse dentro de un CartProvider");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cart, setCart] = cartContext;

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

      console.log("Cliente autenticado: " + usuarioAutenticado);

      if (usuarioAutenticado?.id) {
        sessionStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioAutenticado));

        const criteria: FindPedidosByCriteriaRequest = {
          clienteId: usuarioAutenticado.id,
          tipoEstadoPedidoId: 7,
        };

        const carritoClienteAutenticado = await api.findPedidosByCriteria(criteria);
        setCart(carritoClienteAutenticado[0]);

        console.log("Usuario autenticado:", usuarioAutenticado);
        console.log("Carrito del usuario autenticado: " + carritoClienteAutenticado[0]);
      }

      navigate({ to: "/libroSearch" });
    } catch (error) {
      setError("Error al autenticar el cliente");
      console.error(error);
    }
  };

  function handleGoToSignup() {
    navigate({ to: "/singup" });
  }

  interface MyJwtPayload extends JwtPayload {
    email: string
    name: string
  }

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
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwtDecode<MyJwtPayload>(credentialResponse.credential!);
                console.log("Decoded JWT:", decoded);
                
                const request: FindClienteByEmailRequest = {
                  email: decoded.email
                };
                
                try {
                  const cliente = await api.findClienteByEmail(request);
                  console.log("API response:", cliente);
                  
                  // Si el cliente existe
                  if (cliente !== null) {
                    console.log("Cliente existe:", cliente);
                    
                    if (!cliente.jwt) {
                      cliente.jwt = credentialResponse.credential;
                      
                      const updateRequest: UpdateClienteRequest = {
                        clienteDTO: cliente
                      };
                      
                      const clienteAutenticado = await api.updateCliente(updateRequest);
                      setClienteAutenticado(clienteAutenticado);
                    } else {
                      setClienteAutenticado(cliente);
                    }
                    
                    navigate({ to: "/" });
                  } else {
                    // Si el cliente no existe, registrarlo
                    console.log("Cliente no existe. Creando nuevo cliente.");
                    
                    const nombrePartes = decoded.name.split(" ");
                    const apellido1 = nombrePartes.length > 1 ? nombrePartes[1] : "";
                    const nombre = nombrePartes.length > 0 ? nombrePartes[0] : "";
                    
                    console.log(nombre + " " + apellido1);
                    
                    const clienteRegistrar: ClienteDTO = {
                      email: decoded.email,
                      password: undefined,
                      apellido1: apellido1,
                      apellido2: undefined,
                      jwt: credentialResponse.credential,
                      nickname: undefined,
                      telefono: undefined,
                      dniNie: undefined,
                      direcciones: undefined,
                      nombre: nombre,
                    };
                    
                    const request: RegisterClienteRequest = {
                      clienteDTO: clienteRegistrar
                    };
                    
                    const clienteRegistrado = await api.registerCliente(request);
                    console.log("Cliente registrado:", clienteRegistrado);
                    
                    if (clienteRegistrado) {
                      setClienteAutenticado(clienteRegistrado);
                      sessionStorage.setItem("usuarioAutenticado", JSON.stringify(clienteRegistrado));
                      navigate({ to: "/" });
                    }
                  }
                } catch (error) {
                  console.error("Error al buscar el cliente:", error);
                  
                  // Asumimos que el cliente no existe y procedemos a registrarlo
                  const nombrePartes = decoded.name.split(" ");
                  const apellido1 = nombrePartes.length > 1 ? nombrePartes[1] : "";
                  const nombre = nombrePartes.length > 0 ? nombrePartes[0] : "";
                  
                  console.log(nombre + " " + apellido1);
                  
                  const clienteRegistrar: ClienteDTO = {
                    email: decoded.email,
                    password: undefined,
                    apellido1: apellido1,
                    apellido2: undefined,
                    jwt: credentialResponse.credential,
                    nickname: undefined,
                    telefono: undefined,
                    dniNie: undefined,
                    direcciones: undefined,
                    nombre: nombre,
                  };
                  
                  const request: RegisterClienteRequest = {
                    clienteDTO: clienteRegistrar
                  };
                  
                  try {
                    const clienteRegistrado = await api.registerCliente(request);
                    console.log("Cliente registrado:", clienteRegistrado);
                    
                    if (clienteRegistrado) {
                      setClienteAutenticado(clienteRegistrado);
                      sessionStorage.setItem("usuarioAutenticado", JSON.stringify(clienteRegistrado));
                      navigate({ to: "/" });
                    }
                  } catch (registroError) {
                    console.error("Error al registrar el cliente:", registroError);
                    setError("Error al registrar el cliente con Google");
                  }
                }
              } catch (error) {
                console.error("Error en la autenticación con Google:", error);
                setError("Error en la autenticación con Google");
              }
            }}
            onError={() => {
              console.log("Error en la autenticación");
              setError("Error en la autenticación con Google");
            }}
          />
        </form>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            variant="body2"
            component="span"
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={handleGoToSignup}
          >
            ¿No tienes una cuenta? Regístrate
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;