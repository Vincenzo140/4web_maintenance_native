import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  WrenchIcon,
  AlertTriangle,
  Eye,
  User
} from 'lucide-react';
import { fetchWithAuth } from '../services/api';
import { Clock } from '../components/dashboard/Clock';
import { useStatsStore } from '../store/statsStore';
import { useAuthStore } from '../store/authStore';

interface Stats {
  machines: number;
  teams: number;
  maintenanceCount: number;
}

export function DashboardPage() {
  const { username } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    machines: 0,
    teams: 0,
    maintenanceCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { visitCount, incrementVisits } = useStatsStore();
  const [systemStatus, setSystemStatus] = useState<'Tranquilo!' | 'Alerta!' | 'Ferrou!'>('Tranquilo!');

  useEffect(() => {
    incrementVisits();
    fetchStats();
  }, [incrementVisits]);

  // || stats.teams < 2
  // || stats.teams < 2

  useEffect(() => {
    // Atualizar o status do sistema com base nas estatísticas
    if (stats.maintenanceCount > 50 || stats.teams < 2) { 
      setSystemStatus('Ferrou!');
    } else if (stats.maintenanceCount > 20 || stats.teams < 2) {
      setSystemStatus('Alerta!');
    } else {
      setSystemStatus('Tranquilo!');
    }
  }, [stats]);

  const fetchStats = async () => {
    try {
      const [machines, teams, maintenance] = await Promise.all([
        fetchWithAuth('/machines'),
        fetchWithAuth('/teams'),
        fetchWithAuth('/maintenance'),
      ]);

      setStats({
        machines: Array.isArray(machines) ? machines.length : 0,
        teams: Array.isArray(teams) ? teams.length : 0,
        maintenanceCount: Array.isArray(maintenance) ? maintenance.length : 0
      });
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setError('Falha ao carregar estatísticas do painel');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log('Username:', username);
  // }, [username]);

  useEffect(() => {
    console.log('Username in DashboardPage:', username);
  }, [username]);
  
  
  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color,
    subtitle
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-')}`}>
          <Icon className={`h-6 w-6 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2"> Seja Bem-Vindo{username ? `, ${username}` : ''} </h1>
          <p className="text-gray-600">Monitore as métricas e indicadores principais do seu sistema</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
          <Eye className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Total de Visitas</p>
            <p className="text-lg font-bold text-gray-800">{visitCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total de Máquinas"
            value={stats.machines}
            icon={Settings}
            color="border-blue-500"
            subtitle="Equipamentos ativos"
          />
          <StatCard
            title="Equipes Ativas"
            value={stats.teams}
            icon={Users}
            color="border-green-500"
            subtitle="Equipes de manutenção"
          />
          <StatCard
            title="Registros de Manutenção"
            value={stats.maintenanceCount}
            icon={WrenchIcon}
            color="border-orange-500"
            subtitle="Total de serviços"
          />
        </div>
        <Clock />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Resumo Rápido</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Utilização de Máquinas</span>
              <span className="font-semibold">{Math.round((stats.maintenanceCount / stats.machines) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Eficiência das Equipes</span>
              <span className="font-semibold">{Math.round((stats.maintenanceCount / stats.teams) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Saúde do Sistema</h2>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span>Status do Sistema</span>
              {systemStatus === 'Tranquilo!' && (
                <span className="px-5 py-2 bg-green-500 rounded-full text-sm font-medium">Tranquilo!</span>
              )}
              {systemStatus === 'Alerta!' && (
                <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm font-medium">Alerta!</span>
              )}
              {systemStatus === 'Ferrou!' && (
                <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-medium">Ferrou!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
