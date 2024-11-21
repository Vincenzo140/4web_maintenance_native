import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchWithAuth } from '@/lib/api';

// Define TypeScript types for the state
type PartState = {
  name: string;
  code: string;
  supplier: string;
  quantity: number;
  unit_price: number;
};

type EntryState = {
  quantity: number;
  entry_date: string;
};

type ExitState = {
  quantity: number;
  exit_date: string;
};

// Initial state constants
const INITIAL_PART_STATE: PartState = {
  name: '',
  code: '',
  supplier: '',
  quantity: 0,
  unit_price: 0.0,
};

const INITIAL_ENTRY_STATE: EntryState = {
  quantity: 0,
  entry_date: new Date().toISOString().split('T')[0],
};

const INITIAL_EXIT_STATE: ExitState = {
  quantity: 0,
  exit_date: new Date().toISOString().split('T')[0],
};

export default function PartsManagement() {
  const [postPart, setPostPart] = useState<PartState>(INITIAL_PART_STATE);
  const [entryPart, setEntryPart] = useState<EntryState>(INITIAL_ENTRY_STATE);
  const [backOffPart, setBackOffPart] = useState<ExitState>(INITIAL_EXIT_STATE);
  const [loading, setLoading] = useState(false);

  // Generic input handler for forms
  const handleInputChange = <T,>(
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // API submission function
  const handleSubmit = async (
    endpoint: string,
    data: object,
    successMessage: string
  ) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log(`${successMessage}:`, response);
      alert(successMessage);
      setLoading(false);
    } catch (error: any) {
      console.error('API Error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Peças</h1>
        <p className="text-muted-foreground">
          Gerencie o cadastro, entrada e saída de peças no estoque.
        </p>
      </div>

      {/* Cadastro de Peça */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Peça</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InputField
              id="name"
              label="Nome da Peça"
              placeholder="Ex: Parafuso"
              value={postPart.name}
              onChange={(e) => handleInputChange(e, setPostPart)}
            />
            <InputField
              id="code"
              label="Código"
              placeholder="Ex: PRF123"
              value={postPart.code}
              onChange={(e) => handleInputChange(e, setPostPart)}
            />
            <InputField
              id="supplier"
              label="Fornecedor"
              placeholder="Ex: ABC Supplies"
              value={postPart.supplier}
              onChange={(e) => handleInputChange(e, setPostPart)}
            />
            <InputField
              id="quantity"
              label="Quantidade"
              type="number"
              value={postPart.quantity}
              onChange={(e) => handleInputChange(e, setPostPart)}
            />
            <InputField
              id="unit_price"
              label="Preço Unitário"
              type="number"
              step="0.01"
              value={postPart.unit_price}
              onChange={(e) => handleInputChange(e, setPostPart)}
            />
            <Button
              onClick={() =>
                handleSubmit('/parts', postPart, 'Peça cadastrada com sucesso!')
              }
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Peça'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registro de Entrada no Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Entrada no Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InputField
              id="quantity"
              label="Quantidade"
              type="number"
              value={entryPart.quantity}
              onChange={(e) => handleInputChange(e, setEntryPart)}
            />
            <InputField
              id="entry_date"
              label="Data de Entrada"
              type="date"
              value={entryPart.entry_date}
              onChange={(e) => handleInputChange(e, setEntryPart)}
            />
            <Button
              onClick={() =>
                handleSubmit(
                  '/stock/entry',
                  entryPart,
                  'Entrada registrada com sucesso!'
                )
              }
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Entrada'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registro de Saída do Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Saída do Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InputField
              id="quantity"
              label="Quantidade"
              type="number"
              value={backOffPart.quantity}
              onChange={(e) => handleInputChange(e, setBackOffPart)}
            />
            <InputField
              id="exit_date"
              label="Data de Saída"
              type="date"
              value={backOffPart.exit_date}
              onChange={(e) => handleInputChange(e, setBackOffPart)}
            />
            <Button
              onClick={() =>
                handleSubmit(
                  '/stock/exit',
                  backOffPart,
                  'Saída registrada com sucesso!'
                )
              }
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Saída'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Input Field Component
const InputField = ({
  id,
  label,
  type = 'text',
  step,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  step?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={id}
      type={type}
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
