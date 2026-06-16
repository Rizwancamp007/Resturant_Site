import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1525',
            color: '#f5f0e8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)'
          },
          success: { iconTheme: { primary: '#d4a853', secondary: '#0a0a0f' } },
          error: { iconTheme: { primary: '#e8734a', secondary: '#0a0a0f' } }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
