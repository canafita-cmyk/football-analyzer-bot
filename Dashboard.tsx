import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react';

interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  league: {
    id: number;
    name: string;
    season: number;
  };
}

export default function Dashboard() {
  const [leagueId, setLeagueId] = useState(39);
  const [season, setSeason] = useState(2024);
  const [selectedFixture, setSelectedFixture] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch live matches
  const { data: liveMatches, isLoading: matchesLoading, refetch: refetchMatches } = trpc.football.getLiveMatches.useQuery(
    { leagueId, season },
    { refetchInterval: autoRefresh ? 30000 : false }
  );

  // Fetch match statistics
  const { data: matchStats, isLoading: statsLoading } = trpc.football.getMatchStats.useQuery(
    { fixtureId: selectedFixture || 0 },
    { enabled: !!selectedFixture }
  );

  const handleSelectMatch = (fixtureId: number) => {
    setSelectedFixture(fixtureId);
  };

  const handleRefresh = () => {
    refetchMatches();
  };

  const matches = (liveMatches || []) as Match[];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Football Statistics Monitor</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Real-time corner kicks and fouls analysis</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8 items-center">
          <div className="flex gap-2">
            <select
              value={leagueId}
              onChange={(e) => setLeagueId(Number(e.target.value))}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground"
            >
              <option value={39}>Premier League</option>
              <option value={140}>La Liga</option>
              <option value={135}>Serie A</option>
              <option value={78}>Bundesliga</option>
              <option value={61}>Ligue 1</option>
            </select>

            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>