
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f3f4f6',
          fontFamily: 'sans-serif',
          padding: '2rem',
          textAlign: 'center',
          color: '#ef4444'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Application Error</h1>
          <p style={{ marginTop: '1rem', color: '#4b5563' }}>The application failed to start. This is often caused by a configuration issue.</p>
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '0.5rem',
            maxWidth: '600px',
            textAlign: 'left'
          }}>
            <h2 style={{ fontWeight: 'bold' }}>Error Details:</h2>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              wordWrap: 'break-word', 
              marginTop: '0.5rem',
              color: '#991b1b',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {this.state.error?.message || 'An unknown error occurred.'}
            </pre>
          </div>
           <p style={{ marginTop: '1.5rem', color: '#4b5563', fontWeight: 'bold' }}>
            If the error mentions Supabase secrets, please double-check your Environment Variables in Vercel and trigger a new "Redeploy".
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;