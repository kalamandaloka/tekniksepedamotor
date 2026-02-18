import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import GuruDashboard from './pages/dashboards/GuruDashboard'
import SiswaDashboard from './pages/dashboards/SiswaDashboard'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'guru') return <Navigate to="/guru" replace />;
  return <Navigate to="/siswa" replace />;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/guru" 
            element={
              <PrivateRoute>
                <GuruDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/siswa" 
            element={
              <PrivateRoute>
                <SiswaDashboard />
              </PrivateRoute>
            } 
          />

          <Route path="/" element={<DashboardRedirect />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
