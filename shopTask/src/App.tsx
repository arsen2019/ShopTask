import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import RequireAuth from './components/RequireAuth';
import Dashboard from './components/Dashboard';
import { Navigate } from 'react-router-dom';
import './index.css'
import './App.css'

function App() {

  return (
    <div className="root">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/dashboard"element={<RequireAuth><Dashboard /></RequireAuth>
  }
/>
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App
