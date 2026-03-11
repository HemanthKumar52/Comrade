'use client';
import * as React from 'react';
import { Award } from 'lucide-react';
import { BadgeCard } from './badge-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface BadgeData {
  id: string;
  name: string;
  icon?: string;
  family: string;
  xp: number;
  unlocked: boolean;
  progress?: number;
  imageUrl?: string;
}

interface BadgeGridProps {
  badges: BadgeData[];
}

const families = ['All', 'Distance', 'Place', 'Vehicle', 'Social', 'Nature'];

export function BadgeGrid({ badges }: BadgeGridProps) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Badges</h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-accent">{unlockedCount}</span> / {badges.length} unlocked
        </span>
      </div>

      {/* Filter tabs */}
      <Tabs defaultValue="All">
        <TabsList className="mb-4 flex-wrap">
          {families.map((family) => (
            <TabsTrigger key={family} value={family}>
              {family}
            </TabsTrigger>
          ))}
        </TabsList>

        {families.map((family) => {
          const filtered =
            family === 'All'
              ? badges
              : badges.filter((b) => b.family.toLowerCase() === family.toLowerCase());

          return (
            <TabsContent key={family} value={family}>
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No badges in this category yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filtered.map((badge) => (
                    <BadgeCard key={badge.id} {...badge} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
