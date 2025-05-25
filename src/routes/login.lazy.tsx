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
import { AuthenticateUserRequest, DefaultApi, FindOrdersByCriteriaRequest, FindUserByEmailRequest, RegisterUserRequest, UpdateUserRequest } from '../services/proxy/generated/apis/DefaultApi';
import { UserCredentials } from "../services/proxy/generated/models";
import { CartContext, UserContext } from "../states/contexts";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { User } from "../services/proxy/generated/models";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});


function Login() {
  const api = new DefaultApi();

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
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    console.log(authenticatedUser);

    try {
      const userCredentials: UserCredentials = {
        email: email,
        password: password,
      };

      const authenticateUserRequest: AuthenticateUserRequest = {
        userCredentials: userCredentials,
        locale: "es_ES"
      };

      const authenticatedUser = await api.authenticateUser(authenticateUserRequest);
      setAuthenticatedUser(authenticatedUser);

      console.log("Authenticated user: " + authenticatedUser);

      if (authenticatedUser?.id) {
        sessionStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

        const criteria: FindOrdersByCriteriaRequest = {
          userId: authenticatedUser.id,
          orderStatusId: 6,
        };

        const cartAuthenticatedUser = await api.findOrdersByCriteria(criteria);
        setCart(cartAuthenticatedUser[0]);

        console.log("Authenticated user:", authenticatedUser);
        console.log("Auhtenticated user cart: " + cartAuthenticatedUser[0]);
      }

      navigate({ to: "/bookSearch" });
    } catch (error) {
      setError("Error authenticating the user");
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
            src="imgs/logo.jpg"
            alt="logo thegoldenbook"
            style={{ height: 60 }}
          />
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
                  locale : "es_ES"
                };

                try {
                  const user = await api.findUserByEmail(request);
                  console.log("API response:", user);

                  if (user !== null) {
                    console.log("User exists:", user);

                    if (!user.oauthToken) {
                      console.log("User without jwt");
                      user.oauthToken = credentialResponse.credential;

                      const updateUserRequest: UpdateUserRequest = {
                        user: user,
                        locale: "es_ES"
                      };

                      const authenticatedUser = await api.updateUser(updateUserRequest);
                      setAuthenticatedUser(authenticatedUser);
                      sessionStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

                      const criteria: FindOrdersByCriteriaRequest = {
                        userId: authenticatedUser.id,
                        orderStatusId: 6,
                      };
                      
                      const authenticatedUserCart = await api.findOrdersByCriteria(criteria);
                      setCart(authenticatedUserCart[0]);
                    } else {
                      setAuthenticatedUser(user);
                      console.log("Adding in sessionStorage "+user);
                      sessionStorage.setItem('authenticatedUser', JSON.stringify(user));

                      const criteria: FindOrdersByCriteriaRequest = {
                        userId: user.id,
                        orderStatusId: 6,
                      };

                      const authenticatedUserCart = await api.findOrdersByCriteria(criteria);
                      setCart(authenticatedUserCart[0]);
                    }

                    navigate({ to: "/" });
                  } else {
                    console.log("User does not exist. Creating new user.");

                    const nameParts = decoded.name.split(" ");
                    const lastName = nameParts.length > 1 ? nameParts[1] : "";
                    const name = nameParts.length > 0 ? nameParts[0] : "";

                    console.log(name + " " + lastName);

                    const userRegistration: User = {
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

                    const request: RegisterUserRequest = {
                      user: userRegistration,
                      locale: "es_ES"
                    };

                    const registeredUser = await api.registerUser(request);
                    console.log("Registered user:", registeredUser);

                    if (registeredUser) {
                      setAuthenticatedUser(registeredUser);
                      sessionStorage.setItem("authenticatedUser", JSON.stringify(registeredUser));
                      navigate({ to: "/" });
                    }
                  }
                } catch (error) {
                  console.error("Error searching the user:", error);

                  const nameParts = decoded.name.split(" ");
                  const lastName = nameParts.length > 1 ? nameParts[1] : "";
                  const name = nameParts.length > 0 ? nameParts[0] : "";

                  console.log(name + " " + lastName);

                  const userRegistration: User = {
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

                  const request: RegisterUserRequest = {
                    user: userRegistration,
                    locale: "es_ES"
                  };

                  try {
                    const registeredUser = await api.registerUser(request);
                    console.log("Registered user:", registeredUser);

                    if (registeredUser) {
                      setAuthenticatedUser(registeredUser);
                      sessionStorage.setItem("authenticatedUser", JSON.stringify(registeredUser));
                      navigate({ to: "/" });
                    }
                  } catch (registroError) {
                    console.error("Error registering the user:", registroError);
                    setError("Error registering the user with google");
                  }
                }
              } catch (error) {
                console.error("Error authenticating the user with google:", error);
                setError("Error in authentication with Google");
              }
            }}
            onError={() => {
              console.log("Authentication error");
              setError("Error in authentication with Google");
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