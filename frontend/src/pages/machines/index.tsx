import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMachines } from '@/lib/api';
import { Plus, Search } from 'lucide-react';
import MachineDialog from './machine-dialog';
import { Badge } from '@/components/ui/badge';

interface Machine {
  serial_number: string;
  name: string;
  manufacturer: string;
  model: string;
  status: string;
  location: string;
}

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
    }
  };

  const filteredMachines = machines.filter((machine) =>
    Object.values(machine).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operando':
        return 'bg-green-500';
      case 'em manutenção':
        return 'bg-yellow-500';
      case 'quebrado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Máquinas</h1>
          <p className="text-muted-foreground">
            Gerenciamento de máquinas e equipamentos
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Máquina
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar máquinas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Série</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Localização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine.serial_number}>
                <TableCell className="font-medium">
                  {machine.serial_number}
                </TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.manufacturer}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(machine.status)}>
                    {machine.status}
                  </Badge>
                </TableCell>
                <TableCell>{machine.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MachineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchMachines}
      />
    </div>
  );
}