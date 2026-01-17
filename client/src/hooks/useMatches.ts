import { useState, useEffect } from 'react';
import { apiClient, Match } from '@/lib/api';

interface UseMatchesReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLiveMatches(): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getLiveMatches();
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar partidas');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return { matches, loading, error, refetch: fetchMatches };
}

export function useFinishedMatches(limit: number = 10): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getFinishedMatches(limit);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar histórico');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [limit]);

  return { matches, loading, error, refetch: fetchMatches };
}

export function useMatchesByLeague(league: string): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!league || league === 'all') {
      setMatches([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMatchesByLeague(league);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar partidas');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [league]);

  return { matches, loading, error, refetch: fetchMatches };
}

export function useMatchesByTeam(team: string): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!team || team === 'all') {
      setMatches([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMatchesByTeam(team);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar partidas');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [team]);

  return { matches, loading, error, refetch: fetchMatches };
}
