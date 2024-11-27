import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  WrenchIcon, 
  UsersIcon, 
  PackageIcon, 
  CogIcon,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Layout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => `flex items-center px-4 py-2.5 ${
    isActive(path) 
      ? 'text-blue-600 bg-blue-50 font-medium' 
      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
  } rounded-lg transition-all duration-200`;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-1">
              <Link to="/dashboard" className={linkClass('/dashboard')}>
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Painel
              </Link>
              <Link to="/machines" className={linkClass('/machines')}>
                <CogIcon className="h-5 w-5 mr-2" />
                Máquinas
              </Link>
              <Link to="/maintenance" className={linkClass('/maintenance')}>
                <WrenchIcon className="h-5 w-5 mr-2" />
                Manutenção
              </Link>
              <Link to="/parts" className={linkClass('/parts')}>
                <PackageIcon className="h-5 w-5 mr-2" />
                Peças
              </Link>
              <Link to="/teams" className={linkClass('/teams')}>
                <UsersIcon className="h-5 w-5 mr-2" />
                Equipes
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}