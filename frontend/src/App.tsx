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
import { LandingPage } from './pages/LandingPage';

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
        {/* Rota inicial redireciona para /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Rota pública: Página Inicial */}
        <Route path="/home" element={<LandingPage />} />

        {/* Rotas públicas de autenticação */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
