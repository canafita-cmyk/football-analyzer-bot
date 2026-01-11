import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, RotateCcw, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Match {
  id: number;
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  leagueId: number;
  leagueName: string;
  season: number;
  matchDate: string | Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  statistics?: {
    homeCornerKicks: number;
    awayCornerKicks: number;
    homeFouls: number;
    awayFouls: number;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
    homePossession: number | null;
    awayPossession: number | null;
    homeShots: number | null;
    awayShots: number | null;
  } | null;
}

export default function History() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  // Fetch teams and leagues for filters
  const { data: teams = [] } = trpc.football.getTeams.useQuery();
  const { data: leagues = [] } = trpc.football.getLeagues.useQuery();

  // Fetch historical matches with statistics
  const { data: matchesData = [], isLoading, refetch } = trpc.football.getHistoricalMatchesWithStats.useQuery({
    teamId: selectedTeamId,
    leagueId: selectedLeagueId,
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate).toISOString() : undefined,
    limit,
    offset,
  });

  const matches = useMemo(() => {
    return Array.isArray(matchesData) ? matchesData : [];
  }, [matchesData]);

  const handleResetFilters = () => {
    setSelectedTeamId(undefined);
    setSelectedLeagueId(undefined);
    setStartDate('');
    setEndDate('');
    setOffset(0);
  };

  const handleApplyFilters = () => {
    setOffset(0);
    refetch();
  };

  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePreviousPage = () => {
    setOffset(Math.max(0, offset - limit));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Histórico de Partidas</h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Visualize e compare estatísticas históricas de partidas
          </p>
        </div>

        {/* Filters Section */}
        <Card className="p-6 mb-8 bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Team Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time
              </label>
              <select
                value={selectedTeamId || ''}
                onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="">Todos os times</option>
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* League Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Competição
              </label>
              <select
                value={selectedLeagueId || ''}
                onChange={(e) => setSelectedLeagueId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="">Todas as competições</option>
                {leagues.map((league: any) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Inicial
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
                />
              </div>
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Final
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* Matches List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Carregando partidas...</p>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma partida encontrada com os filtros selecionados</p>
            </Card>
          ) : (
            <>
              {matches.map((match: Match) => (
                <Card key={match.id} className="p-6 bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Match Info */}
                    <div className="md:col-span-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {match.leagueName}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          match.status === 'FT' ? 'bg-green-100 text-green-800' :
                          match.status === 'LIVE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.status === 'FT' ? 'Finalizado' : match.status === 'LIVE' ? 'Ao Vivo' : 'Agendado'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {format(new Date(match.matchDate), 'dd MMM yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>

                    {/* Match Score */}
                    <div className="md:col-span-1">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <p className="text-sm font-semibold text-foreground mb-1">{match.homeTeamName}</p>
                          <p className="text-2xl font-bold text-primary">
                            {match.homeScore !== null ? match.homeScore : '-'}
                          </p>
                        </div>
                        <div className="px-3 text-muted-foreground text-xs font-medium">vs</div>
                        <div className="text-center flex-1">
                          <p className="text-sm font-semibold text-foreground mb-1">{match.awayTeamName}</p>
                          <p className="text-2xl font-bold text-primary">
                            {match.awayScore !== null ? match.awayScore : '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Statistics Preview */}
                    <div className="md:col-span-1">
                      {match.statistics ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-background rounded p-2">
                            <p className="text-xs text-muted-foreground mb-1">Escanteios</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.homeCornerKicks}
                              </span>
                              <span className="text-xs text-muted-foreground">-</span>
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.awayCornerKicks}
                              </span>
                            </div>
                          </div>
                          <div className="bg-background rounded p-2">
                            <p className="text-xs text-muted-foreground mb-1">Faltas</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.homeFouls}
                              </span>
                              <span className="text-xs text-muted-foreground">-</span>
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.awayFouls}
                              </span>
                            </div>
                          </div>
                          <div className="bg-background rounded p-2">
                            <p className="text-xs text-muted-foreground mb-1">Cartões Amarelos</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.homeYellowCards}
                              </span>
                              <span className="text-xs text-muted-foreground">-</span>
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.awayYellowCards}
                              </span>
                            </div>
                          </div>
                          <div className="bg-background rounded p-2">
                            <p className="text-xs text-muted-foreground mb-1">Cartões Vermelhos</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.homeRedCards}
                              </span>
                              <span className="text-xs text-muted-foreground">-</span>
                              <span className="text-sm font-semibold text-foreground">
                                {match.statistics.awayRedCards}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Sem dados de estatísticas
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  onClick={handlePreviousPage}
                  disabled={offset === 0}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted disabled:opacity-50"
                >
                  Página Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Mostrando {offset + 1} a {Math.min(offset + limit, offset + matches.length)} de {offset + matches.length}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={matches.length < limit}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Próxima Página
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
