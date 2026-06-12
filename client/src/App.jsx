import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ─── Lazy-loaded page components ───────────────────────────────────────────────
// Admin layout + pages
const DashboardLayout          = lazy(() => import('./components/DashboardLayout'));
const Dashboard                = lazy(() => import('./pages/Dashboard'));
const Institutions             = lazy(() => import('./pages/Institutions'));
const Students                 = lazy(() => import('./pages/Students'));
const Performance              = lazy(() => import('./pages/Performance'));
const Reports                  = lazy(() => import('./pages/Reports'));
const Tests                    = lazy(() => import('./pages/Tests'));
const Approval                 = lazy(() => import('./pages/Approval'));
const Academies                = lazy(() => import('./pages/Academies'));
const Profile                  = lazy(() => import('./pages/Profile'));

// Admin auth pages
const ForgotPassword           = lazy(() => import('./pages/ForgotPassword'));
const AdminLogin               = lazy(() => import('./pages/admin/AdminLogin'));

// Institute auth pages
const InstituteLogin           = lazy(() => import('./pages/institute/InstituteLogin'));
const InstituteRegister        = lazy(() => import('./pages/institute/InstituteRegister'));
const InstituteForgotPassword  = lazy(() => import('./pages/institute/InstituteForgotPassword'));

// Institute dashboard
const InstituteDashboardLayout = lazy(() => import('./components/institute/InstituteDashboardLayout'));
const InstituteDashboard       = lazy(() => import('./pages/institute/InstituteDashboard'));
const InstituteStudents        = lazy(() => import('./pages/institute/InstituteStudents'));

// Academy dashboard
const AcademyDashboardLayout   = lazy(() => import('./components/academy/AcademyDashboardLayout'));
const AcademyDashboard         = lazy(() => import('./pages/academy/AcademyDashboard'));
const AcademyStudents          = lazy(() => import('./pages/academy/AcademyStudents'));

// ─── Suspense fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: '#f8fafc'
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '3px solid #e2e8f0',
      borderTopColor: '#4f46e5',
      animation: 'spin 0.75s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}')
  }));

  useEffect(() => {
    const validateSession = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setAuth({ token: null, user: {} });
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth({ token: null, user: {} });
          return;
        }

        if (!res.ok) return;

        const data = await res.json();
        const profileUser = data.user || {};
        const institute = data.institute || null;
        const nextUser = {
          id: profileUser._id || profileUser.id,
          name: profileUser.name,
          role: profileUser.role,
          email: profileUser.email,
          approvalStatus: profileUser.approvalStatus,
          avatar: profileUser.avatar,
          instituteId: institute?._id,
          instituteName: institute?.name,
          instituteType: institute?.type,
          sport: institute?.sport
        };

        localStorage.setItem('user', JSON.stringify(nextUser));
        setAuth({ token: savedToken, user: nextUser });
      } catch (error) {
        // Keep the current session during temporary network/server failures.
      }
    };

    validateSession();
  }, [API_URL]);

  const token = auth.token;
  const user = auth.user || {};
  const isAuthenticated = !!token;
  const isAdmin = isAuthenticated && user.role === 'admin';
  const isInstitute = isAuthenticated && user.role === 'institution' && user.instituteType !== 'academy';
  const isAcademy = isAuthenticated && user.role === 'institution' && user.instituteType === 'academy';

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
          element={isInstitute ? <InstituteDashboardLayout key={user.instituteId || user.id} /> : <Navigate to="/institute/login" />}
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
          element={isAcademy ? <AcademyDashboardLayout key={user.instituteId || user.id} /> : <Navigate to="/institute/login" />}
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
