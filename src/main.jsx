import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from "../src/context/AuthContext.jsx"; 
import { SubscribeProvider } from './context/SubscribeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <SubscribeProvider>
      <App />
    </SubscribeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);