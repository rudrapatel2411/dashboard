import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Sports from './pages/Sports';
import Performance from './pages/Performance';
import Reports from './pages/Reports';

function App() {
  // Simple auth check mock (replace with real auth state in a real app context)
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="sports" element={<Sports />} />
          <Route path="performance" element={<Performance />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
