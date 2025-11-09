
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CompetitionProvider } from './context/CompetitionContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CompetitionProvider>
        <App />
      </CompetitionProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);