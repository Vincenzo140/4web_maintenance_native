import { useState, useEffect } from 'react';
import { Team } from '../types';
import { getTeams } from '../services/api';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      if (Array.isArray(data)) {
        setTeams(data);
        setError(null);
      } else {
        throw new Error("Formato inválido de dados.");
      }
    } catch (err) {
      console.error("Erro ao buscar equipes:", err);
      setError("Não foi possível carregar os dados das equipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    teams,
    loading,
    error
  };
};