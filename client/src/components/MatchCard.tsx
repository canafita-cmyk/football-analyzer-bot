import { Clock, MapPin } from 'lucide-react';

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  league: string;
  time: string;
  onClick?: () => void;
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  league,
  time,
  onClick,
}: MatchCardProps) {
  const statusColors = {
    scheduled: 'bg-muted text-muted-foreground',
    live: 'bg-secondary text-secondary-foreground animate-pulse',
    finished: 'bg-muted text-muted-foreground',
    postponed: 'bg-accent text-accent-foreground',
  };

  const statusLabels = {
    scheduled: 'Agendado',
    live: 'AO VIVO',
    finished: 'Finalizado',
    postponed: 'Adiado',
  };

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {time}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-right">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{homeTeam}</p>
        </div>
        <div className="px-4 py-2 mx-2">
          {status === 'scheduled' ? (
            <p className="text-sm text-muted-foreground">vs</p>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {homeScore} - {awayScore}
              </p>
            </div>
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{awayTeam}</p>
        </div>
      </div>

      <div className="flex items-center justify-center text-xs text-muted-foreground">
        <MapPin className="w-3 h-3 mr-1" />
        {league}
      </div>
    </div>
  );
}
