import { useState, useEffect } from 'react';
import { Machine } from '../types';
import { getMachines } from '../services/api';
import { filterMachinesByStatus } from '../utils/filterHelpers';

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      const data = await getMachines();
      if (Array.isArray(data)) {
        setMachines(data);
        setError(null);
      } else {
        throw new Error("Formato inválido de dados.");
      }
    } catch (err) {
      console.error("Erro ao buscar máquinas:", err);
      setError("Não foi possível carregar os dados das máquinas.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setFilteredMachines(filterMachinesByStatus(machines, filter));
  };

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleFilterChange(selectedFilter);
  }, [machines]);

  return {
    machines,
    filteredMachines,
    selectedFilter,
    loading,
    error,
    handleFilterChange
  };
};