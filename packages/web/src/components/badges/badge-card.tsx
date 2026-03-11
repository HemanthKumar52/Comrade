'use client';
import { Lock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  name: string;
  icon?: string;
  family: string;
  xp: number;
  unlocked: boolean;
  progress?: number; // 0-100
  imageUrl?: string;
}

export function BadgeCard({
  name,
  icon,
  family,
  xp,
  unlocked,
  progress = 0,
  imageUrl,
}: BadgeCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 transition-all hover:scale-105 hover:shadow-lg cursor-pointer',
        !unlocked && 'opacity-70'
      )}
    >
      {/* Badge icon */}
      <div className="relative mb-3">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-full text-2xl',
            unlocked
              ? 'bg-accent/10 text-accent'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className={cn('h-10 w-10 object-contain', !unlocked && 'grayscale')}
            />
          ) : (
            <span>{icon || '🏅'}</span>
          )}
        </div>

        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-900/30 dark:bg-gray-900/50">
            <Lock className="h-5 w-5 text-white" />
          </div>
        )}

        {/* Progress ring for partial completion */}
        {!unlocked && progress > 0 && (
          <svg className="absolute -inset-1 h-[4.5rem] w-[4.5rem] -rotate-90">
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="text-accent transition-all duration-500"
            />
          </svg>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-900 dark:text-white text-center line-clamp-1">
        {name}
      </p>

      {/* Family tag */}
      <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary dark:text-primary-200">
        {family}
      </span>

      {/* XP */}
      <div className="mt-2 flex items-center gap-1 text-xs text-accent font-medium">
        <Zap className="h-3 w-3" />
        {xp} XP
      </div>

      {/* Progress percentage */}
      {!unlocked && progress > 0 && (
        <p className="mt-1 text-[10px] text-gray-400">{Math.round(progress)}% complete</p>
      )}
    </div>
  );
}
