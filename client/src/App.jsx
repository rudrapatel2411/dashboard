import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Performance from './pages/Performance';
import Reports from './pages/Reports';
import Institutes from './pages/Institutes';
import Tests from './pages/Tests';
import Approval from './pages/Approval';

function App() {
  // Check if JWT token exists in localStorage for real authentication
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - Redirect to dashboard if already authenticated */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
        
        {/* Protected Routes - Redirect to login if not authenticated */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="institutes" element={<Institutes />} />
          <Route path="tests" element={<Tests />} />
          <Route path="approval" element={<Approval />} />
          <Route path="performance" element={<Performance />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

