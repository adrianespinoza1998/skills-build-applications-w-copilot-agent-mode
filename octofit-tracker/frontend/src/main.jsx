import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';

if (import.meta.env.DEV && !import.meta.env.VITE_CODESPACE_NAME) {
  console.warn('VITE_CODESPACE_NAME is not defined. Add it to .env.local for Codespaces, or the app will fall back to localhost:8000.');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
