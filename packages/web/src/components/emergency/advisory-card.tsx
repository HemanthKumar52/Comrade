'use client';
import { Calendar, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

type AdvisoryLevel = 'safe' | 'caution' | 'avoid' | 'do-not-travel';

interface AdvisoryCardProps {
  country: string;
  countryCode: string;
  level: AdvisoryLevel;
  description: string;
  updatedAt: string;
}

const levelConfig: Record<AdvisoryLevel, { label: string; variant: 'success' | 'warning' | 'accent' | 'danger'; color: string }> = {
  safe: { label: 'Safe', variant: 'success', color: 'border-l-emerald-500' },
  caution: { label: 'Exercise Caution', variant: 'warning', color: 'border-l-amber-500' },
  avoid: { label: 'Avoid Non-Essential', variant: 'accent', color: 'border-l-orange-500' },
  'do-not-travel': { label: 'Do Not Travel', variant: 'danger', color: 'border-l-red-500' },
};

export function AdvisoryCard({
  country,
  countryCode,
  level,
  description,
  updatedAt,
}: AdvisoryCardProps) {
  const config = levelConfig[level];

  return (
    <Card className={cn('border-l-4', config.color)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Flag */}
          <span className="text-3xl leading-none" role="img" aria-label={country}>
            {getFlagEmoji(countryCode)}
          </span>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{country}</h3>
              <Badge variant={config.variant} className="shrink-0">
                <Shield className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
            </div>

            {/* Description */}
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>

            {/* Updated */}
            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar className="h-3 w-3" />
              Updated{' '}
              {new Date(updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}
