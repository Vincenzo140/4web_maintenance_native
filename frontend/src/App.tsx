import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MachinesPage } from './pages/MachinesPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { PartsPage } from './pages/PartsPage';
import { TeamsPage } from './pages/TeamsPage';
import { useAuthStore } from './store/authStore';
import { SignUpPage } from './pages/SignUpPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Redirecionamento inicial para signup */}
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/signup"} replace />}
        />

        {/* Rota para Signup */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Rota para Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="parts" element={<PartsPage />} />
          <Route path="teams" element={<TeamsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
