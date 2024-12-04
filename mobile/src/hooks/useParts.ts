import { useState, useEffect } from 'react';
import { Part } from '../types';
import { getParts } from '../services/api';

export const useParts = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    try {
      const data = await getParts();
      if (Array.isArray(data)) {
        setParts(data);
        setError(null);
      } else {
        throw new Error("Formato inválido de dados.");
      }
    } catch (err) {
      console.error("Erro ao buscar peças:", err);
      setError("Não foi possível carregar os dados das peças.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
    const interval = setInterval(fetchParts, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    parts,
    loading,
    error
  };
};