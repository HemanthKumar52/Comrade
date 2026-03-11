'use client';
import * as React from 'react';
import { FileText, Mic, Image, CheckSquare, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';

type NoteType = 'text' | 'voice' | 'photo' | 'plan';

interface Trip {
  id: string;
  title: string;
}

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialType?: NoteType;
  initialTags?: string[];
  initialTripId?: string;
  trips?: Trip[];
  onSave?: (data: {
    title: string;
    content: string;
    type: NoteType;
    tags: string[];
    tripId?: string;
  }) => void;
  onCancel?: () => void;
}

const typeIcons: Record<NoteType, React.ElementType> = {
  text: FileText,
  voice: Mic,
  photo: Image,
  plan: CheckSquare,
};

export function NoteEditor({
  initialTitle = '',
  initialContent = '',
  initialType = 'text',
  initialTags = [],
  initialTripId,
  trips = [],
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [content, setContent] = React.useState(initialContent);
  const [type, setType] = React.useState<NoteType>(initialType);
  const [tagsInput, setTagsInput] = React.useState(initialTags.join(', '));
  const [tripId, setTripId] = React.useState(initialTripId || '');

  const handleSave = () => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSave?.({ title, content, type, tags, tripId: tripId || undefined });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-accent" />
          {initialTitle ? 'Edit Note' : 'New Note'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Type selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <Tabs value={type} onValueChange={(v) => setType(v as NoteType)}>
            <TabsList>
              {(Object.keys(typeIcons) as NoteType[]).map((t) => {
                const Icon = typeIcons[t];
                return (
                  <TabsTrigger key={t} value={t} className="gap-1.5 capitalize">
                    <Icon className="h-4 w-4" />
                    {t}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="text">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={6}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </TabsContent>
            <TabsContent value="voice">
              <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 py-8">
                <Mic className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">Tap to start recording</p>
                <Button variant="accent" size="sm">
                  <Mic className="mr-1.5 h-4 w-4" />
                  Record
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="photo">
              <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 py-8">
                <Image className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">Drop an image or click to upload</p>
                <Button variant="outline" size="sm">
                  <Image className="mr-1.5 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="plan">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Plan your activities (one per line)..."
                rows={6}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-mono"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          placeholder="food, culture, adventure (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        {/* Trip selector */}
        {trips.length > 0 && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link to Trip
            </label>
            <Select value={tripId} onValueChange={setTripId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a trip (optional)" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="accent" className="flex-1" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Note
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
