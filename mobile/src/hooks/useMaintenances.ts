import { useState, useEffect } from 'react';
import { Maintenance } from '../types';
import { getMaintenances } from '../services/api';

export const useMaintenances = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenances = async () => {
    try {
      const data = await getMaintenances();
      if (Array.isArray(data)) {
        setMaintenances(data);
        setError(null);
      } else {
        throw new Error("Formato inválido de dados.");
      }
    } catch (err) {
      console.error("Erro ao buscar manutenções:", err);
      setError("Não foi possível carregar os dados das manutenções.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
    const interval = setInterval(fetchMaintenances, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    maintenances,
    loading,
    error
  };
};