import { Outlet } from 'react-router-dom';
import { useAuth } from './auth-provider';
import Sidebar from './sidebar';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}