'use client';
import { Zap } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  levelName: string;
  levelIcon?: string;
  currentXP: number;
  requiredXP: number;
  className?: string;
}

export function LevelProgress({
  levelName,
  levelIcon = '🧭',
  currentXP,
  requiredXP,
  className,
}: LevelProgressProps) {
  const percent = Math.min((currentXP / requiredXP) * 100, 100);

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{levelIcon}</span>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{levelName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Current Level</p>
        </div>
      </div>

      <Progress value={percent} variant="accent" className="h-3 mb-2" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm font-medium text-accent">
          <Zap className="h-4 w-4" />
          {currentXP.toLocaleString()} XP
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {requiredXP.toLocaleString()} XP needed
        </span>
      </div>
    </div>
  );
}
