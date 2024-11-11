import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import {
  LayoutDashboard,
  Cog,
  Users,
  Package,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Máquinas',
      href: '/machines',
      icon: Cog,
    },
    {
      name: 'Peças',
      href: '/parts',
      icon: Package,
    },
    {
      name: 'Equipes',
      href: '/teams',
      icon: Users,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-card">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-2xl font-bold">Industrial Pro</h1>
      </div>
      <div className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2',
                  isActive && 'bg-accent'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}