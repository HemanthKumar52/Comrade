'use client';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TravelStreakProps {
  streakDays: number;
  last30Days: boolean[]; // true = traveled that day, index 0 = 30 days ago
  className?: string;
}

export function TravelStreak({ streakDays, last30Days, className }: TravelStreakProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5',
        className
      )}
    >
      {/* Streak count */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Flame className="h-6 w-6 text-accent" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {streakDays}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">days</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Travel streak</p>
        </div>
      </div>

      {/* Mini calendar dots */}
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Last 30 days</p>
        <div className="flex flex-wrap gap-1">
          {last30Days.map((traveled, i) => (
            <div
              key={i}
              className={cn(
                'h-3 w-3 rounded-sm transition-colors',
                traveled
                  ? 'bg-accent'
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
              title={`${30 - i} days ago${traveled ? ' - Traveled' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
