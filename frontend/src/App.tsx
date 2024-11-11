import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth-provider';
import Layout from '@/components/layout';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Machines from '@/pages/machines';
import Parts from '@/pages/parts';
import Teams from '@/pages/teams';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="machines" element={<Machines />} />
        <Route path="parts" element={<Parts />} />
        <Route path="teams" element={<Teams />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;