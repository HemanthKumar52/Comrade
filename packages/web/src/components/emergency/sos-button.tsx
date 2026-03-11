'use client';
import * as React from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  onActivate?: () => void;
  holdDuration?: number; // ms, default 3000
}

export function SOSButton({ onActivate, holdDuration = 3000 }: SOSButtonProps) {
  const [pressing, setPressing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activated, setActivated] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(0);

  const startPress = () => {
    if (activated) return;
    setPressing(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setActivated(true);
        setPressing(false);
        onActivate?.();
      }
    }, 30);
  };

  const endPress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setPressing(false);
    if (!activated) {
      setProgress(0);
    }
  };

  const reset = () => {
    setActivated(false);
    setProgress(0);
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SOS Button */}
      <div className="relative">
        {/* Pulse ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            pressing && 'animate-ping bg-red-500/20',
            activated && 'animate-pulseGlow'
          )}
          style={{ margin: '-8px' }}
        />

        {/* Progress ring */}
        <svg
          width={140}
          height={140}
          className="absolute -inset-[6px] -rotate-90"
        >
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="rgba(239,68,68,0.2)"
            strokeWidth={4}
          />
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="#EF4444"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-75"
          />
        </svg>

        {/* Button */}
        <button
          onMouseDown={startPress}
          onMouseUp={endPress}
          onMouseLeave={endPress}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          className={cn(
            'relative flex h-[128px] w-[128px] items-center justify-center rounded-full text-white font-bold text-2xl tracking-wider shadow-lg transition-transform select-none',
            activated
              ? 'bg-red-700 scale-95'
              : 'bg-red-500 hover:bg-red-600 active:scale-95'
          )}
        >
          {activated ? (
            <Phone className="h-8 w-8" />
          ) : (
            'SOS'
          )}
        </button>
      </div>

      {/* Text */}
      {activated ? (
        <div className="text-center">
          <p className="text-sm font-semibold text-red-600">Emergency Activated</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Contacting emergency services...
          </p>
          <button
            onClick={reset}
            className="mt-3 text-xs font-medium text-gray-500 hover:text-gray-700 underline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Press &amp; hold for {holdDuration / 1000} seconds
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            This will alert emergency contacts and services
          </p>
        </div>
      )}
    </div>
  );
}
