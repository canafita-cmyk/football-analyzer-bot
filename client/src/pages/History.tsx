import { Calendar, Filter, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import { useState } from 'react';
import { useFinishedMatches, useMatchesByLeague, useMatchesByTeam } from '@/hooks/useMatches';

export default function History() {
  const [filterType, setFilterType] = useState<'all' | 'league' | 'team'>('all');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const leagues = [
    { id: 'all', name: 'Todas as Ligas' },
    { id: 'pl', name: 'Premier League' },
    { id: 'la', name: 'La Liga' },
    { id: 'serie', name: 'Série A' },
    { id: 'bundesliga', name: 'Bundesliga' },
  ];

  const teams = [
    { id: 'all', name: 'Todos os Times' },
    { id: 'man-city', name: 'Manchester City' },
    { id: 'liverpool', name: 'Liverpool' },
    { id: 'real', name: 'Real Madrid' },
    { id: 'barca', name: 'Barcelona' },
  ];

  // Buscar dados baseado no filtro
  const allMatches = useFinishedMatches(20);
  const leagueMatches = useMatchesByLeague(selectedLeague);
  const teamMatches = useMatchesByTeam(selectedTeam);

  let matches = allMatches.matches;
  let loading = allMatches.loading;
  let error = allMatches.error;

  if (filterType === 'league' && selectedLeague !== 'all') {
    matches = leagueMatches.matches;
    loading = leagueMatches.loading;
    error = leagueMatches.error;
  } else if (filterType === 'team' && selectedTeam !== 'all') {
    matches = teamMatches.matches;
    loading = teamMatches.loading;
    error = teamMatches.error;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Histórico de Partidas</h1>
        <p className="text-muted-foreground">Analise estatísticas de partidas anteriores</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tipo de Filtro</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas as Partidas</option>
              <option value="league">Por Liga</option>
              <option value="team">Por Time</option>
            </select>
          </div>

          {filterType === 'league' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Liga</label>
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'team' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Time</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Partidas Analisadas</p>
              <p className="text-3xl font-bold text-foreground">{matches.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary/20" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Média de Escanteios</p>
              <p className="text-3xl font-bold text-foreground">
                {matches.length > 0
                  ? (matches.reduce((sum, m) => sum + (m.corners || 0), 0) / matches.length).toFixed(1)
                  : '0'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary/20" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Previsões Acertadas</p>
              <p className="text-3xl font-bold text-foreground">89%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/20" />
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Partidas</h2>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
            <span className="text-muted-foreground">Carregando histórico...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-accent" />
            <div>
              <p className="font-medium text-foreground">Erro ao carregar histórico</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma partida encontrada com os filtros selecionados</p>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
