import { ArrowRight, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface TeamStats {
  name: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

export default function Comparison() {
  const [team1, setTeam1] = useState('man-city');
  const [team2, setTeam2] = useState('liverpool');

  const teams = [
    { id: 'man-city', name: 'Manchester City' },
    { id: 'liverpool', name: 'Liverpool' },
    { id: 'real', name: 'Real Madrid' },
    { id: 'barca', name: 'Barcelona' },
    { id: 'psg', name: 'PSG' },
    { id: 'bayern', name: 'Bayern Munich' },
  ];

  const teamStats: Record<string, TeamStats> = {
    'man-city': {
      name: 'Manchester City',
      wins: 18,
      draws: 2,
      losses: 1,
      goalsFor: 62,
      goalsAgainst: 18,
      corners: 142,
      fouls: 187,
      yellowCards: 24,
      redCards: 1,
    },
    'liverpool': {
      name: 'Liverpool',
      wins: 17,
      draws: 3,
      losses: 1,
      goalsFor: 58,
      goalsAgainst: 21,
      corners: 138,
      fouls: 195,
      yellowCards: 28,
      redCards: 0,
    },
    'real': {
      name: 'Real Madrid',
      wins: 16,
      draws: 2,
      losses: 2,
      goalsFor: 55,
      goalsAgainst: 20,
      corners: 135,
      fouls: 172,
      yellowCards: 22,
      redCards: 1,
    },
    'barca': {
      name: 'Barcelona',
      wins: 15,
      draws: 3,
      losses: 2,
      goalsFor: 52,
      goalsAgainst: 22,
      corners: 130,
      fouls: 165,
      yellowCards: 20,
      redCards: 0,
    },
    'psg': {
      name: 'PSG',
      wins: 14,
      draws: 4,
      losses: 2,
      goalsFor: 50,
      goalsAgainst: 25,
      corners: 125,
      fouls: 180,
      yellowCards: 26,
      redCards: 1,
    },
    'bayern': {
      name: 'Bayern Munich',
      wins: 16,
      draws: 1,
      losses: 3,
      goalsFor: 60,
      goalsAgainst: 19,
      corners: 140,
      fouls: 175,
      yellowCards: 23,
      redCards: 0,
    },
  };

  const stats1 = teamStats[team1];
  const stats2 = teamStats[team2];

  const StatComparison = ({ label, value1, value2 }: { label: string; value1: number; value2: number }) => {
    const max = Math.max(value1, value2);
    const percentage1 = (value1 / max) * 100;
    const percentage2 = (value2 / max) * 100;

    return (
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="bg-background rounded-lg overflow-hidden h-8">
              <div
                className="bg-gradient-to-r from-primary to-blue-600 h-full flex items-center justify-end pr-3 transition-all duration-300"
                style={{ width: `${percentage1}%` }}
              >
                {percentage1 > 20 && <span className="text-white text-xs font-bold">{value1}</span>}
              </div>
            </div>
            {percentage1 <= 20 && <p className="text-xs text-foreground mt-1">{value1}</p>}
          </div>

          <div className="w-12 text-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto" />
          </div>

          <div className="flex-1">
            <div className="bg-background rounded-lg overflow-hidden h-8">
              <div
                className="bg-gradient-to-l from-secondary to-green-600 h-full flex items-center justify-start pl-3 transition-all duration-300"
                style={{ width: `${percentage2}%` }}
              >
                {percentage2 > 20 && <span className="text-white text-xs font-bold">{value2}</span>}
              </div>
            </div>
            {percentage2 <= 20 && <p className="text-xs text-foreground mt-1">{value2}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Comparação de Times</h1>
        <p className="text-muted-foreground">Compare estatísticas entre dois times</p>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Time 1</label>
          <select
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-center">
          <div className="text-center pb-2">
            <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">COMPARAR</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Time 2</label>
          <select
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="bg-card rounded-lg border border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-8">Estatísticas Comparativas</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Team 1 */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 text-right">{stats1.name}</h3>
          </div>

          {/* Right side - Team 2 */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">{stats2.name}</h3>
          </div>
        </div>

        <div className="space-y-8">
          <StatComparison label="Vitórias" value1={stats1.wins} value2={stats2.wins} />
          <StatComparison label="Empates" value1={stats1.draws} value2={stats2.draws} />
          <StatComparison label="Derrotas" value1={stats1.losses} value2={stats2.losses} />
          <StatComparison label="Gols Marcados" value1={stats1.goalsFor} value2={stats2.goalsFor} />
          <StatComparison label="Gols Sofridos" value1={stats1.goalsAgainst} value2={stats2.goalsAgainst} />
          <StatComparison label="Escanteios" value1={stats1.corners} value2={stats2.corners} />
          <StatComparison label="Faltas" value1={stats1.fouls} value2={stats2.fouls} />
          <StatComparison label="Cartões Amarelos" value1={stats1.yellowCards} value2={stats2.yellowCards} />
          <StatComparison label="Cartões Vermelhos" value1={stats1.redCards} value2={stats2.redCards} />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-lg border border-primary/20 p-6">
          <p className="text-sm text-muted-foreground mb-2">Análise</p>
          <p className="text-foreground">
            {stats1.name} apresenta uma ligeira vantagem em escanteios e gols marcados, enquanto {stats2.name} tem um desempenho defensivo mais sólido.
          </p>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-green-600/10 rounded-lg border border-secondary/20 p-6">
          <p className="text-sm text-muted-foreground mb-2">Recomendação</p>
          <p className="text-foreground">
            Para um confronto direto, recomenda-se acompanhar de perto os escanteios e faltas, que são os principais diferenciadores entre os times.
          </p>
        </div>
      </div>
    </div>
  );
}
