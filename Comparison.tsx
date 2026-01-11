import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowRight, Calendar } from 'lucide-react';

interface TeamStats {
  teamId: number;
  matchCount: number;
  averageCorners: number;
  averageFouls: number;
  averageYellowCards: number;
  averageRedCards: number;
  averageShots: number;
  averagePossession: number;
  totalCorners: number;
  totalFouls: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalShots: number;
}

export default function Comparison() {
  const [team1Id, setTeam1Id] = useState<number | undefined>();
  const [team2Id, setTeam2Id] = useState<number | undefined>();
  const [leagueId, setLeagueId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Fetch teams and leagues
  const { data: teams = [] } = trpc.football.getTeams.useQuery();
  const { data: leagues = [] } = trpc.football.getLeagues.useQuery();

  // Fetch team statistics
  const { data: team1Stats, isLoading: loading1 } = trpc.football.getTeamStatistics.useQuery(
    {
      teamId: team1Id || 0,
      leagueId,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    },
    { enabled: !!team1Id }
  );

  const { data: team2Stats, isLoading: loading2 } = trpc.football.getTeamStatistics.useQuery(
    {
      teamId: team2Id || 0,
      leagueId,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    },
    { enabled: !!team2Id }
  );

  const team1Name = teams.find((t: any) => t.id === team1Id)?.name || 'Time 1';
  const team2Name = teams.find((t: any) => t.id === team2Id)?.name || 'Time 2';

  // Prepare comparison data
  const comparisonData = team1Stats && team2Stats ? [
    {
      metric: 'Escanteios (Média)',
      [team1Name]: Number(team1Stats.averageCorners.toFixed(2)),
      [team2Name]: Number(team2Stats.averageCorners.toFixed(2)),
    },
    {
      metric: 'Faltas (Média)',
      [team1Name]: Number(team1Stats.averageFouls.toFixed(2)),
      [team2Name]: Number(team2Stats.averageFouls.toFixed(2)),
    },
    {
      metric: 'Cartões Amarelos (Média)',
      [team1Name]: Number(team1Stats.averageYellowCards.toFixed(2)),
      [team2Name]: Number(team2Stats.averageYellowCards.toFixed(2)),
    },
    {
      metric: 'Cartões Vermelhos (Média)',
      [team1Name]: Number(team1Stats.averageRedCards.toFixed(2)),
      [team2Name]: Number(team2Stats.averageRedCards.toFixed(2)),
    },
    {
      metric: 'Chutes (Média)',
      [team1Name]: Number(team1Stats.averageShots.toFixed(2)),
      [team2Name]: Number(team2Stats.averageShots.toFixed(2)),
    },
    {
      metric: 'Posse de Bola (Média %)',
      [team1Name]: Number(team1Stats.averagePossession.toFixed(2)),
      [team2Name]: Number(team2Stats.averagePossession.toFixed(2)),
    },
  ] : [];

  const totalData = team1Stats && team2Stats ? [
    {
      metric: 'Escanteios (Total)',
      [team1Name]: team1Stats.totalCorners,
      [team2Name]: team2Stats.totalCorners,
    },
    {
      metric: 'Faltas (Total)',
      [team1Name]: team1Stats.totalFouls,
      [team2Name]: team2Stats.totalFouls,
    },
    {
      metric: 'Cartões Amarelos (Total)',
      [team1Name]: team1Stats.totalYellowCards,
      [team2Name]: team2Stats.totalYellowCards,
    },
    {
      metric: 'Cartões Vermelhos (Total)',
      [team1Name]: team1Stats.totalRedCards,
      [team2Name]: team2Stats.totalRedCards,
    },
    {
      metric: 'Chutes (Total)',
      [team1Name]: team1Stats.totalShots,
      [team2Name]: team2Stats.totalShots,
    },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Comparação de Times</h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Compare estatísticas de dois times lado a lado
          </p>
        </div>

        {/* Selection Section */}
        <Card className="p-6 mb-8 bg-card border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Team 1 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time 1
              </label>
              <select
                value={team1Id || ''}
                onChange={(e) => setTeam1Id(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="">Selecione um time</option>
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Team 2 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time 2
              </label>
              <select
                value={team2Id || ''}
                onChange={(e) => setTeam2Id(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="">Selecione um time</option>
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
                value={leagueId || ''}
                onChange={(e) => setLeagueId(e.target.value ? Number(e.target.value) : undefined)}
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

            {/* Start Date */}
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

            {/* End Date */}
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
        </Card>

        {/* Comparison Results */}
        {team1Stats && team2Stats ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Team 1 Summary */}
              <Card className="p-6 bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">{team1Name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Partidas Analisadas</span>
                    <span className="text-lg font-semibold text-primary">{team1Stats.matchCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Escanteios (Média)</span>
                    <span className="text-lg font-semibold text-primary">
                      {team1Stats.averageCorners.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Faltas (Média)</span>
                    <span className="text-lg font-semibold text-primary">
                      {team1Stats.averageFouls.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cartões Amarelos (Média)</span>
                    <span className="text-lg font-semibold text-primary">
                      {team1Stats.averageYellowCards.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Team 2 Summary */}
              <Card className="p-6 bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">{team2Name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Partidas Analisadas</span>
                    <span className="text-lg font-semibold text-primary">{team2Stats.matchCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Escanteios (Média)</span>
                    <span className="text-lg font-semibold text-primary">
                      {team2Stats.averageCorners.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Faltas (Média)</span>
                    <span className="text-lg font-semibold text-primary">
                      {team2Stats.averageFouls.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cartões Amarelos (Média)</span>
                    <span className="text-lg font-semibold text-primary">
                      {team2Stats.averageYellowCards.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            {comparisonData.length > 0 && (
              <>
                {/* Average Statistics Chart */}
                <Card className="p-6 bg-card border border-border mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas Médias</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="metric" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
                        labelStyle={{ color: '#1f2937' }}
                      />
                      <Legend />
                      <Bar dataKey={team1Name} fill="#3b82f6" />
                      <Bar dataKey={team2Name} fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Total Statistics Chart */}
                <Card className="p-6 bg-card border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas Totais</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={totalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="metric" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
                        labelStyle={{ color: '#1f2937' }}
                      />
                      <Legend />
                      <Bar dataKey={team1Name} fill="#3b82f6" />
                      <Bar dataKey={team2Name} fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </>
            )}
          </>
        ) : (
          <Card className="p-8 text-center bg-card border border-border">
            <p className="text-muted-foreground">
              {loading1 || loading2
                ? 'Carregando dados...'
                : 'Selecione dois times para comparar suas estatísticas'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
