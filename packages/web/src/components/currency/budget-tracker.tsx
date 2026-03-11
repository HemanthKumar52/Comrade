'use client';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CategoryBudget {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface BudgetTrackerProps {
  totalBudget: number;
  totalSpent: number;
  currency?: string;
  dailyLimit?: number;
  dailySpent?: number;
  categories: CategoryBudget[];
  className?: string;
}

export function BudgetTracker({
  totalBudget,
  totalSpent,
  currency = 'INR',
  dailyLimit,
  dailySpent = 0,
  categories,
  className,
}: BudgetTrackerProps) {
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - spentPercent / 100);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-5 w-5 text-accent" />
          Budget Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ring chart */}
        <div className="flex justify-center">
          <div className="relative" style={{ width: 160, height: 160 }}>
            <svg width={160} height={160} className="-rotate-90">
              <circle
                cx={80}
                cy={80}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={12}
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx={80}
                cy={80}
                r={radius}
                fill="none"
                stroke={spentPercent > 90 ? '#EF4444' : spentPercent > 70 ? '#F59E0B' : '#E8733A'}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Spent</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.round(spentPercent)}%
              </span>
              <span className="text-[10px] text-gray-400">
                {formatCurrency(remaining, currency)} left
              </span>
            </div>
          </div>
        </div>

        {/* Total budget display */}
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalBudget, currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400">Spent</p>
            <p className="font-semibold text-accent">
              {formatCurrency(totalSpent, currency)}
            </p>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            By Category
          </h4>
          {categories.map((cat) => {
            const catPercent = Math.min((cat.spent / cat.budget) * 100, 100);
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.budget, currency)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${catPercent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily limit */}
        {dailyLimit && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Daily Limit</span>
              <span className={cn(
                'font-medium',
                dailySpent > dailyLimit ? 'text-red-500' : 'text-gray-900 dark:text-white'
              )}>
                {formatCurrency(dailySpent, currency)} / {formatCurrency(dailyLimit, currency)}
              </span>
            </div>
            <Progress
              value={Math.min((dailySpent / dailyLimit) * 100, 100)}
              variant={dailySpent > dailyLimit * 0.8 ? 'accent' : 'primary'}
              className="h-1.5"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
