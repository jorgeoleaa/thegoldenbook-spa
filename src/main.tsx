import { createRoot } from "react-dom/client";
//import { StrictMode } from "react";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = "494708978820-bnu3m83cdhv2e50lsgmg2vmihibi0o3q.apps.googleusercontent.com"

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  //</StrictMode>
);
