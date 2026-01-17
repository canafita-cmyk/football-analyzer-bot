import { BarChart3, Zap, Target, Users, AlertCircle, Loader2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import MatchCard from '@/components/MatchCard';
import { useState } from 'react';
import { useLiveMatches } from '@/hooks/useMatches';

export default function Dashboard() {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const { matches: liveMatches, loading, error } = useLiveMatches();

  // Calcular estatísticas agregadas das partidas
  const totalCorners = liveMatches.reduce((sum, match) => sum + (match.corners || 0), 0);
  const totalFouls = liveMatches.reduce((sum, match) => sum + (match.fouls || 0), 0);
  const totalYellowCards = liveMatches.reduce((sum, match) => sum + (match.yellowCards || 0), 0);

  const stats = [
    {
      title: 'Escanteios (Ao Vivo)',
      value: totalCorners.toString(),
      subtitle: `${liveMatches.length} partidas`,
      icon: <Target className="w-6 h-6" />,
      color: 'blue' as const,
      trend: 'up' as const,
    },
    {
      title: 'Faltas Registradas',
      value: totalFouls.toString(),
      subtitle: `Média: ${(totalFouls / Math.max(liveMatches.length, 1)).toFixed(1)} por jogo`,
      icon: <Zap className="w-6 h-6" />,
      color: 'orange' as const,
      trend: 'neutral' as const,
    },
    {
      title: 'Cartões Amarelos',
      value: totalYellowCards.toString(),
      subtitle: 'Últimas 24h',
      icon: <Users className="w-6 h-6" />,
      color: 'green' as const,
      trend: 'down' as const,
    },
    {
      title: 'Partidas Ativas',
      value: liveMatches.filter(m => m.status === 'live').length.toString(),
      subtitle: 'Em tempo real',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'purple' as const,
      trend: 'up' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Análise em tempo real de estatísticas de futebol</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Live Matches Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Partidas em Tempo Real</h2>
            <p className="text-sm text-muted-foreground mt-1">Acompanhe as estatísticas ao vivo</p>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg border border-secondary/30">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-secondary">
                {liveMatches.filter(m => m.status === 'live').length} partidas ao vivo
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
            <span className="text-muted-foreground">Carregando partidas...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-accent" />
            <div>
              <p className="font-medium text-foreground">Erro ao carregar partidas</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!loading && liveMatches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma partida encontrada no momento</p>
          </div>
        )}

        {!loading && liveMatches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                {...match}
                onClick={() => setSelectedMatch(match.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected Match Details */}
      {selectedMatch && liveMatches.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-8">
          {(() => {
            const match = liveMatches.find(m => m.id === selectedMatch);
            return match ? (
              <>
                <h3 className="text-xl font-bold text-foreground mb-6">
                  {match.homeTeam} vs {match.awayTeam}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Escanteios</p>
                    <p className="text-2xl font-bold text-primary">{match.corners || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Faltas</p>
                    <p className="text-2xl font-bold text-accent">{match.fouls || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Cartões Amarelos</p>
                    <p className="text-2xl font-bold text-secondary">{match.yellowCards || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Cartões Vermelhos</p>
                    <p className="text-2xl font-bold text-accent">{match.redCards || 0}</p>
                  </div>
                </div>
              </>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
