import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig"; // Ensure this exists and is correctly set up

// Create and export the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
