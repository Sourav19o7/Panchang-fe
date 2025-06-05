import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Import global styles
import './styles/global.css';
import './styles/components.css';
import './styles/utilities.css';
import 'react-toastify/dist/ReactToastify.css';

// Error boundary component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    
    // You can log errors to an external service here
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>🚨 Something went wrong</h1>
          <p>
            We're sorry, but something unexpected happened. 
            Please try refreshing the page or contact support if the problem persists.
          </p>
          <button onClick={this.handleRetry}>
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left' }}>
              <summary>Error Details (Development)</summary>
              <pre style={{ 
                background: '#f1f5f9', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginTop: '1rem',
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {this.state.error?.toString()}
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Main app initialization
function initializeApp() {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <AppErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <App />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastStyle={{
                  fontSize: '14px',
                  borderRadius: '8px'
                }}
              />
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Hot module replacement for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    initializeApp();
  });
}

// Service worker registration (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}