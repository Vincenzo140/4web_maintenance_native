import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMachines, getMaintenances, getParts, getTeams } from '@/lib/api';
import { Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data: machines } = useQuery({ 
    queryKey: ['machines'],
    queryFn: getMachines
  });

  const { data: maintenances } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => getMaintenances()
  });

  const { data: parts } = useQuery({
    queryKey: ['parts'],
    queryFn: getParts
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams
  });

  const pendingMaintenances = maintenances?.filter(m => m.status === 'pending').length || 0;
  const completedMaintenances = maintenances?.filter(m => m.status === 'completed').length || 0;
  const lowStockParts = parts?.filter(p => p.quantity < 10).length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Máquinas Totais</CardTitle>
          <Loader2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{machines?.length || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingMaintenances}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peças com Estoque Baixo</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockParts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manutenções Concluídas</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedMaintenances}</div>
        </CardContent>
      </Card>
    </div>
  );
}