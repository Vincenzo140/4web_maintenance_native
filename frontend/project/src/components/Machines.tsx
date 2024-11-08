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
import { Textarea } from '@/components/ui/textarea';
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
import { getMachines, createMachine, deleteMachine, updateMachine, Machine } from '@/lib/api';
import { Plus, Trash2, Pencil, Search } from 'lucide-react';

export function Machines() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const queryClient = useQueryClient();

  const { data: machines, isLoading } = useQuery({
    queryKey: ['machines'],
    queryFn: getMachines,
  });

  const createMutation = useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      setOpen(false);
      toast.success('Máquina cadastrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cadastrar máquina');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ serial, data }: { serial: string; data: Partial<Machine> }) =>
      updateMachine(serial, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      setSelectedMachine(null);
      toast.success('Máquina atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar máquina');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast.success('Máquina removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover máquina');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      model: formData.get('model') as string,
      type: formData.get('type') as string,
      manufacture_data: formData.get('manufacture_data') as string,
      location: formData.get('location') as string,
      maintenance_history: formData.get('maintenance_history') as string,
      status: 'operational',
    };

    if (selectedMachine) {
      updateMutation.mutate({
        serial: selectedMachine.serial_number,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredMachines = machines?.filter((machine) =>
    Object.values(machine).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Máquinas</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar máquinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog
            open={open || !!selectedMachine}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) setSelectedMachine(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Máquina
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedMachine ? 'Editar Máquina' : 'Adicionar Nova Máquina'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedMachine?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Input
                    id="type"
                    name="type"
                    defaultValue={selectedMachine?.type}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    name="model"
                    defaultValue={selectedMachine?.model}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacture_data">Data de Fabricação</Label>
                  <Input
                    id="manufacture_data"
                    name="manufacture_data"
                    type="date"
                    defaultValue={selectedMachine?.manufacture_data}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={selectedMachine?.location}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance_history">Histórico de Manutenção</Label>
                  <Textarea
                    id="maintenance_history"
                    name="maintenance_history"
                    defaultValue={selectedMachine?.maintenance_history}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    {selectedMachine ? 'Atualizar' : 'Salvar'}
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
              <TableHead>Número de Série</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines?.map((machine: Machine) => (
              <TableRow key={machine.serial_number}>
                <TableCell>{machine.serial_number}</TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{machine.status}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMachine(machine)}
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
                          Tem certeza que deseja remover esta máquina? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(machine.serial_number)}
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