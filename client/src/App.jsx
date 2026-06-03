import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Existing Admin pages
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Institutions from './pages/Institutions';
import Students from './pages/Students';
import Performance from './pages/Performance';
import Reports from './pages/Reports';
import Tests from './pages/Tests';
import Approval from './pages/Approval';
import Academies from './pages/Academies';
import Profile from './pages/Profile';

// New Auth pages
import AdminLogin from './pages/admin/AdminLogin';
import InstituteLogin from './pages/institute/InstituteLogin';
import InstituteRegister from './pages/institute/InstituteRegister';
import InstituteForgotPassword from './pages/institute/InstituteForgotPassword';

// Institute Dashboard
import InstituteDashboardLayout from './components/institute/InstituteDashboardLayout';
import InstituteDashboard from './pages/institute/InstituteDashboard';
import InstituteStudents from './pages/institute/InstituteStudents';


// Academy Dashboard
import AcademyDashboardLayout from './components/academy/AcademyDashboardLayout';
import AcademyDashboard from './pages/academy/AcademyDashboard';
import AcademyStudents from './pages/academy/AcademyStudents';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!token;
  const isAdmin = isAuthenticated && user.role === 'admin';
  const isInstitute = isAuthenticated && user.role === 'institution' && user.instituteType !== 'academy';
  const isAcademy = isAuthenticated && user.role === 'institution' && user.instituteType === 'academy';

  return (
    <BrowserRouter>
      <Routes>

        {/* ========= Legacy redirects (prevent broken bookmarks) ========= */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/register" element={<Navigate to="/institute/register" replace />} />

        {/* ========= Admin Auth Routes ========= */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route 
          path="/admin/login" 
          element={isAdmin ? <Navigate to="/dashboard" /> : <AdminLogin />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} 
        />

        {/* ========= Institute / Academy Auth Routes ========= */}
        <Route 
          path="/institute/login" 
          element={isAcademy ? <Navigate to="/academy/dashboard" /> : isInstitute ? <Navigate to="/institute/dashboard" /> : <InstituteLogin />} 
        />
        <Route 
          path="/institute/register" 
          element={isAcademy ? <Navigate to="/academy/dashboard" /> : isInstitute ? <Navigate to="/institute/dashboard" /> : <InstituteRegister />} 
        />
        <Route 
          path="/institute/forgot-password" 
          element={isAcademy ? <Navigate to="/academy/dashboard" /> : isInstitute ? <Navigate to="/institute/dashboard" /> : <InstituteForgotPassword />} 
        />

        {/* ========= Admin Protected Routes ========= */}
        <Route 
          path="/" 
          element={isAdmin ? <DashboardLayout /> : <Navigate to="/institute/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="institutions" element={<Institutions />} />
          <Route path="academies" element={<Academies />} />
          <Route path="students" element={<Students />} />
          <Route path="approval" element={<Approval />} />
          <Route path="performance" element={<Performance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ========= Institute Protected Routes ========= */}
        <Route 
          path="/institute" 
          element={isInstitute ? <InstituteDashboardLayout /> : <Navigate to="/institute/login" />}
        >
          <Route index element={<Navigate to="/institute/dashboard" />} />
          <Route path="dashboard" element={<InstituteDashboard />} />
          <Route path="students" element={<InstituteStudents />} />
          <Route path="physical-tests" element={<Tests />} />
          <Route path="performance" element={<Performance />} />
          <Route path="reports" element={<Reports />} />

          <Route path="profile" element={<Profile />} />

        </Route>

        {/* ========= Academy Protected Routes ========= */}
        <Route 
          path="/academy" 
          element={isAcademy ? <AcademyDashboardLayout /> : <Navigate to="/institute/login" />}
        >
          <Route index element={<Navigate to="/academy/dashboard" />} />
          <Route path="dashboard" element={<AcademyDashboard />} />
          <Route path="students" element={<AcademyStudents />} />
          <Route path="physical-tests" element={<Tests />} />
          <Route path="performance" element={<Performance />} />
          <Route path="reports" element={<Reports />} />

          <Route path="profile" element={<Profile />} />

        </Route>

        {/* ========= Catch-all ========= */}
        <Route path="*" element={
          <Navigate to={isAdmin ? '/dashboard' : isAcademy ? '/academy/dashboard' : isInstitute ? '/institute/dashboard' : '/institute/login'} replace />
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
