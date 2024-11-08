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
import { getParts, createPart, registerPartEntry, registerPartExit, Part } from '@/lib/api';
import { Plus, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';

export function Parts() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [operationType, setOperationType] = useState<'entry' | 'exit' | null>(null);
  const queryClient = useQueryClient();

  const { data: parts, isLoading } = useQuery({
    queryKey: ['parts'],
    queryFn: getParts,
  });

  const createMutation = useMutation({
    mutationFn: createPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      setOpen(false);
      toast.success('Peça cadastrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cadastrar peça');
    },
  });

  const entryMutation = useMutation({
    mutationFn: ({ code, quantity }: { code: string; quantity: number }) =>
      registerPartEntry(code, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      setSelectedPart(null);
      setOperationType(null);
      toast.success('Entrada registrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao registrar entrada');
    },
  });

  const exitMutation = useMutation({
    mutationFn: ({ code, quantity }: { code: string; quantity: number }) =>
      registerPartExit(code, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      setSelectedPart(null);
      setOperationType(null);
      toast.success('Saída registrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao registrar saída');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get('name') as string,
      supplier: formData.get('supplier') as string,
      unit_price: Number(formData.get('unit_price')),
      quantity: 0,
    });
  };

  const handleQuantityOperation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPart) return;

    const quantity = Number(new FormData(e.currentTarget).get('quantity'));
    if (operationType === 'entry') {
      entryMutation.mutate({ code: selectedPart.code, quantity });
    } else if (operationType === 'exit') {
      exitMutation.mutate({ code: selectedPart.code, quantity });
    }
  };

  const filteredParts = parts?.filter((part) =>
    Object.values(part).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Peças</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar peças..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Peça
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Peça</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input id="supplier" name="supplier" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_price">Preço Unitário</Label>
                  <Input
                    id="unit_price"
                    name="unit_price"
                    type="number"
                    step="0.01"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={!!selectedPart} onOpenChange={() => setSelectedPart(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {operationType === 'entry' ? 'Registrar Entrada' : 'Registrar Saída'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuantityOperation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Preço Unitário</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParts?.map((part: Part) => (
              <TableRow key={part.code}>
                <TableCell>{part.code}</TableCell>
                <TableCell>{part.name}</TableCell>
                <TableCell>{part.supplier}</TableCell>
                <TableCell>R$ {part.unit_price.toFixed(2)}</TableCell>
                <TableCell>{part.quantity}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPart(part);
                      setOperationType('entry');
                    }}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPart(part);
                      setOperationType('exit');
                    }}
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}