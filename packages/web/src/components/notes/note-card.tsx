'use client';
import { FileText, Mic, Image, CheckSquare, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

type NoteType = 'text' | 'voice' | 'photo' | 'plan';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  date: string;
  tripTitle?: string;
  onClick?: (id: string) => void;
}

const typeConfig: Record<NoteType, { icon: React.ElementType; color: string }> = {
  text: { icon: FileText, color: 'text-blue-500' },
  voice: { icon: Mic, color: 'text-purple-500' },
  photo: { icon: Image, color: 'text-emerald-500' },
  plan: { icon: CheckSquare, color: 'text-amber-500' },
};

export function NoteCard({
  id,
  title,
  content,
  type,
  date,
  tripTitle,
  onClick,
}: NoteCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800',
              config.color
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {title}
            </h3>

            {/* Content preview */}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {truncateText(content, 120)}
            </p>

            {/* Footer */}
            <div className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Calendar className="h-3 w-3" />
                {new Date(date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {tripTitle && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {tripTitle}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
