import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import App from './App.jsx';
import { hideLoader } from './lib/loader';
import { announceL20N } from './lib/l20nConsole';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

hideLoader();

announceL20N();
