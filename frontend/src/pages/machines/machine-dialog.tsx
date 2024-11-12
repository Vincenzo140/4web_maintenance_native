import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { createMachine } from '@/lib/api';
import { toast } from 'sonner';

interface MachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface MachineData {
  name: string;
  type: string;
  model: string;
  manufacturer: string;
  serial_number: string;
  specifications: string;
  location: string;
  maintenance_history: string[];
  status: 'operando' | 'Quebrado' | 'Em Manutenção';
}

export default function MachineDialog({
  open,
  onOpenChange,
  onSuccess,
}: MachineDialogProps) {
  const [formData, setFormData] = useState<MachineData>({
    name: '',
    type: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    specifications: '',
    location: '',
    maintenance_history: [],
    status: 'operando',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMachine(formData);
      toast.success('Máquina cadastrada com sucesso!');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao cadastrar máquina.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaintenanceHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      maintenance_history: value.split(',').map((item) => item.trim()),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Máquina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="serial_number">Número de Série</Label>
              <Input
                id="serial_number"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manufacturer">Fabricante</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specifications">Especificações</Label>
              <Input
                id="specifications"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance_history">Histórico de Manutenção</Label>
              <Input
                id="maintenance_history"
                name="maintenance_history"
                value={formData.maintenance_history.join(', ')}
                onChange={handleMaintenanceHistoryChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as MachineData['status'] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operando">Operando</SelectItem>
                  <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                  <SelectItem value="Quebrado">Quebrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
