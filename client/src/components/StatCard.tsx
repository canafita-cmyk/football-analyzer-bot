import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend = 'neutral',
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'from-primary to-blue-600',
    green: 'from-secondary to-green-600',
    orange: 'from-accent to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const trendColors = {
    up: 'text-secondary',
    down: 'text-accent',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
      {trend !== 'neutral' && (
        <div className={`text-xs font-semibold ${trendColors[trend]}`}>
          {trend === 'up' ? '↑ Acima da média' : '↓ Abaixo da média'}
        </div>
      )}
    </div>
  );
}
