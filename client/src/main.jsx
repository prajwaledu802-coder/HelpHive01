import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import LanguageProvider from './contexts/LanguageProvider';
import './styles.css';

const routerBase = import.meta.env.VITE_ROUTER_BASENAME || '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBase}>
      <ThemeProvider>
        <LanguageProvider>
          <SocketProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </SocketProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

