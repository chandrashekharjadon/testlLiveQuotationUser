import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react';
import './index.css';
import { BrowserRouter } from "react-router-dom";

import { store } from './app/store'
import { Provider } from 'react-redux'

import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from "./msalConfig";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <App />
      </Provider>
    </MsalProvider>
  </BrowserRouter>
)
