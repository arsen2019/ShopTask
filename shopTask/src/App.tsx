import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      {/* Wrap entire app with QueryProvider */}
      <QueryProvider>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegistrationForm />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;