import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// FIX: Replaced React.PropsWithChildren with an explicit props interface to resolve a typing issue where 'this.props' was not found.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isSupabaseError = this.state.error?.message.includes('DIAGNOSTIC ERROR: Supabase secrets not found');

      if (isSupabaseError) {
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f9fafb',
            fontFamily: 'sans-serif',
            padding: '2rem',
            textAlign: 'center',
            color: '#111827'
          }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Database Connection Error</h1>
            <p style={{ marginTop: '0.5rem', color: '#4b5563', maxWidth: '600px', fontSize: '1.125rem' }}>
              The application could not connect to the database because the required credentials are missing.
            </p>
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.75rem',
              maxWidth: '700px',
              textAlign: 'left'
            }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#b91c1c' }}>Action Required for Developers</h2>
              <p style={{marginTop: '0.75rem', color: '#4b5563'}}>
                To resolve this, please set the Supabase environment variables in your deployment environment (e.g., Vercel) or in a local <code>.env</code> file.
              </p>
              <p style={{marginTop: '1rem', color: '#4b5563'}}>You need to set <strong>one</strong> of the following pairs:</p>
              <div style={{ marginTop: '1rem', backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem', border: '1px solid #e5e7eb' }}>
                <p>VITE_SUPABASE_URL=...<br />VITE_SUPABASE_ANON_KEY=...</p>
                <p style={{color: '#6b7280', fontFamily: 'sans-serif', fontSize: '0.8rem', marginTop: '0.5rem'}}>(Recommended for Vite/Vercel)</p>
                <hr style={{ margin: '1rem 0' }}/>
                <p>SUPABASE_URL=...<br />SUPABASE_ANON_KEY=...</p>
              </div>
            </div>
             <p style={{ marginTop: '2rem', color: '#4b5563', fontWeight: '500' }}>
              Once the variables are set, please redeploy or restart your application.
            </p>
          </div>
        );
      }
      
      // Default error boundary for other errors
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
          <p style={{ marginTop: '1rem', color: '#4b5563' }}>An unexpected error occurred. Please check the console for details.</p>
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
              overflowY: 'auto',
              fontFamily: 'monospace'
            }}>
              {this.state.error?.message || 'An unknown error occurred.'}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
