import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { getMachines } from '@/lib/api';
import { AlertCircle, CheckCircle2, WrenchIcon } from 'lucide-react';

interface Machine {
  serial_number: string;
  name: string;
  status: string;
}

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    operating: 0,
    maintenance: 0,
    broken: 0,
  });

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
        
        const stats = data.reduce(
          (acc: any, machine: Machine) => {
            acc.total++;
            if (machine.status === 'operando') acc.operating++;
            if (machine.status === 'Em Manutenção') acc.maintenance++;
            if (machine.status === 'Quebrado') acc.broken++;
            return acc;
          },
          { total: 0, operating: 0, maintenance: 0, broken: 0 }
        );
        
        setStats(stats);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      }
    };

    fetchMachines();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de manutenção industrial
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Operação</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.operating}</div>
            <Progress 
              value={(stats.operating / stats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <WrenchIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenance}</div>
            <Progress 
              value={(stats.maintenance / stats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quebradas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.broken}</div>
            <Progress 
              value={(stats.broken / stats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas Recentes</CardTitle>
          <CardDescription>
            Últimas notificações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.broken > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Existem {stats.broken} máquinas com problemas que precisam de atenção.
              </AlertDescription>
            </Alert>
          )}
          {stats.maintenance > 0 && (
            <Alert variant="warning" className="mt-2">
              <WrenchIcon className="h-4 w-4" />
              <AlertDescription>
                {stats.maintenance} máquinas estão em manutenção programada.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}