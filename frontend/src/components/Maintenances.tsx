import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  getMaintenances,
  createMaintenance,
  deleteMaintenance,
  updateMaintenance,
  getMachines,
  getTeams,
  Maintenance,
} from '@/lib/api';
import { Plus, Trash2, Pencil, Search } from 'lucide-react';

export function Maintenances() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const queryClient = useQueryClient();

  const { data: maintenances, isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => getMaintenances(),
  });

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: getMachines,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  });

  const createMutation = useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setOpen(false);
      toast.success('Manutenção registrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao registrar manutenção');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Maintenance> }) =>
      updateMaintenance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setSelectedMaintenance(null);
      toast.success('Manutenção atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar manutenção');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      toast.success('Manutenção removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover manutenção');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      machine_id: formData.get('machine_id') as string,
      team_name: formData.get('team_name') as string,
      problem_description: formData.get('problem_description') as string,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string || 'pending',
      request_date: new Date().toISOString(),
    };

    if (selectedMaintenance) {
      updateMutation.mutate({
        id: selectedMaintenance.maintenance_register_id,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredMaintenances = maintenances?.filter((maintenance) =>
    Object.values(maintenance).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manutenções</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar manutenções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog
            open={open || !!selectedMaintenance}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) setSelectedMaintenance(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Manutenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedMaintenance ? 'Editar Manutenção' : 'Registrar Nova Manutenção'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="machine_id">Máquina</Label>
                  <Select
                    name="machine_id"
                    defaultValue={selectedMaintenance?.machine_id}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma máquina" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines?.map((machine) => (
                        <SelectItem key={machine.serial_number} value={machine.serial_number}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team_name">Equipe</Label>
                  <Select
                    name="team_name"
                    defaultValue={selectedMaintenance?.team_name}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma equipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams?.map((team) => (
                        <SelectItem key={team.team_name} value={team.team_name}>
                          {team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problem_description">Descrição do Problema</Label>
                  <Textarea
                    id="problem_description"
                    name="problem_description"
                    defaultValue={selectedMaintenance?.problem_description}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    name="priority"
                    defaultValue={selectedMaintenance?.priority || 'medium'}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedMaintenance && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      defaultValue={selectedMaintenance.status}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    {selectedMaintenance ? 'Atualizar' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Máquina</TableHead>
              <TableHead>Equipe</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaintenances?.map((maintenance: Maintenance) => (
              <TableRow key={maintenance.maintenance_register_id}>
                <TableCell>{maintenance.maintenance_register_id}</TableCell>
                <TableCell>{maintenance.machine_id}</TableCell>
                <TableCell>{maintenance.team_name}</TableCell>
                <TableCell>{maintenance.priority}</TableCell>
                <TableCell>{maintenance.status}</TableCell>
                <TableCell>
                  {new Date(maintenance.request_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMaintenance(maintenance)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover esta manutenção? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(maintenance.maintenance_register_id)}
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}