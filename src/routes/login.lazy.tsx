import React, { useContext, useEffect, useState } from "react";
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
import {
  AuthenticateUserRequest,
  DefaultApi,
  FindOrdersByCriteriaRequest,
  FindUserByEmailRequest,
  RegisterUserRequest,
  UpdateUserRequest,
} from "../services/proxy/generated/apis/DefaultApi";
import { UserCredentials } from "../services/proxy/generated/models";
import { CartContext, UserContext } from "../states/contexts";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { User } from "../services/proxy/generated/models";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const api = new DefaultApi();
  const navigate = useNavigate();

  // --- Contextos de usuario y carrito ---
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within UserProvider");
  }
  const [authenticatedUser, setAuthenticatedUser] = userContext;

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

  useEffect(() => {
    if (!authenticatedUser) return;

    sessionStorage.setItem("authenticatedUser", JSON.stringify(authenticatedUser));

    (async () => {
      try {
        const criteria: FindOrdersByCriteriaRequest = {
          userId: authenticatedUser.id,
          orderStatusId: 6,
        };
        const cartForUser = await api.findOrdersByCriteria(criteria);
        setCart(cartForUser[0]);
      } catch (e) {
        console.error("Error al traer el carrito:", e);
      }
    })();

    navigate({ to: "/bookSearch" });
  }, [authenticatedUser, api, navigate, setCart]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const userCredentials: UserCredentials = {
      email: email,
      password: password,
    };
    const authenticateUserRequest: AuthenticateUserRequest = {
      userCredentials: userCredentials,
      locale: "es_ES",
    };

    try {
      const authenticatedUserCorrectly = await api.authenticateUser(authenticateUserRequest);
      console.log("authenticatedUserCorrectly:", authenticatedUserCorrectly);
      setAuthenticatedUser(authenticatedUserCorrectly);
    } catch (e) {
      console.error("Error en authenticateUser:", e);
      setError("Error autenticando al usuario");
    }
  };

  function handleGoToSignup() {
    navigate({ to: "/signup" });
  }

  interface MyJwtPayload extends JwtPayload {
    email: string;
    name: string;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img src="imgs/logo.jpg" alt="logo thegoldenbook" style={{ height: 60 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            The Golden Book
          </Typography>
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="body1" paragraph>
          Please enter the following fields to log in.
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
            label="Password"
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
            label="Remember me"
          />
          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Link href="#" variant="body2">
              Forgot your password?
            </Link>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log in
          </Button>

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwtDecode<MyJwtPayload>(credentialResponse.credential!);
                console.log("Decoded JWT:", decoded);

                const request: FindUserByEmailRequest = {
                  email: decoded.email,
                  locale: "es_ES",
                };

                try {
                  const user = await api.findUserByEmail(request);
                  console.log("API response:", user);

                  if (user) {
                    // Si el usuario existe, lo actualizamos o simplemente usamos setAuthenticatedUser
                    if (!user.oauthToken) {
                      user.oauthToken = credentialResponse.credential;
                      const updateUserRequest: UpdateUserRequest = {
                        user: user,
                        locale: "es_ES",
                      };
                      const authenticatedUserApi = await api.updateUser(updateUserRequest);
                      setAuthenticatedUser(authenticatedUserApi);
                    } else {
                      setAuthenticatedUser(user);
                    }
                  } else {
                    // Si no existe, lo registramos y luego seteamos
                    const nameParts = decoded.name.split(" ");
                    const lastName = nameParts.length > 1 ? nameParts[1] : "";
                    const name = nameParts.length > 0 ? nameParts[0] : "";

                    const newUser: User = {
                      email: decoded.email,
                      password: undefined,
                      lastName: lastName,
                      secondLastName: undefined,
                      oauthToken: credentialResponse.credential,
                      nickname: undefined,
                      phoneNumber: undefined,
                      nationalId: undefined,
                      addresses: undefined,
                      name: name,
                    };
                    const registerRequest: RegisterUserRequest = {
                      user: newUser,
                      locale: "es_ES",
                    };
                    const registeredUser = await api.registerUser(registerRequest);
                    setAuthenticatedUser(registeredUser);
                  }
                } catch (e) {
                  console.error("Error buscando/registrando el usuario:", e);
                  setError("Error con la autenticación de Google");
                }
              } catch (e) {
                console.error("Error decodificando JWT:", e);
                setError("Error en autenticación con Google");
              }
            }}
            onError={() => {
              console.log("Authentication error");
              setError("Error en autenticación con Google");
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
            Don't have an account? Sign up
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
