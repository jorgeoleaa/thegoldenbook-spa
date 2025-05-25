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
import { DefaultApi, RegisterUserRequest } from '../services/proxy/generated/apis/DefaultApi';
import { createLazyFileRoute } from "@tanstack/react-router";
import { User } from "../services/proxy/generated";

export const Route = createLazyFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const api = new DefaultApi();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [oauthToken, setOAuthToken] = useState("");

  const register = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!name || !nickname || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const newUser: User = {
        name: name,
        nickname: nickname,
        lastName: lastName,
        secondLastName: secondLastName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        nationalId: nationalId,
        oauthToken: undefined,
      };

      const request: RegisterUserRequest = { 
        user: newUser,
        locale: "es_ES"
       };

      const registeredUser = await api.registerUser(request);

      setSuccess("Registration completed successfully! You can now log in.");
      sessionStorage.setItem("authenticatedUser", JSON.stringify(registeredUser));
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (error) {
      setError("Failed to register the client. Please try again.");
      console.error("Registration error", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img src="imgs/logo.jpg" alt="logo thegoldenbook" style={{ height: 60 }} />
          <Typography variant="h4" gutterBottom>
            The Golden Book
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          Creat your account
        </Typography>
        <Typography variant="body1" paragraph>
          Please enter your details to register.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nickname" fullWidth required value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Second Last Name" fullWidth value={secondLastName} onChange={(e) => setSecondLastName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="National ID" fullWidth value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone Number" fullWidth value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Confirm Password" type="password" fullWidth required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={register}>
            Sign up
          </Button>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link href="/login" variant="body2">
            Already have an account? Log in
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
