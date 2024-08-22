import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {  RouterProvider } from "react-router-dom";
import { router } from './Routes/Routes.jsx';
import AuthProviders from './providers/AuthProvider.jsx';





createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProviders>
      <div>
        <RouterProvider router={router} />
      </div>
    </AuthProviders>
  </StrictMode>
);
