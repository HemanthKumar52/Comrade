'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, FileText, Mic, Camera, Calendar,
  Folder, MoreVertical, Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotes } from '@/hooks/useNotes';
import { cn } from '@/lib/utils';

const typeTabs = [
  { id: 'all', label: 'All Notes', icon: FileText },
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'photo', label: 'Photo', icon: Camera },
  { id: 'plan', label: 'Plans', icon: Calendar },
];

const typeIcons: Record<string, React.ElementType> = {
  text: FileText, voice: Mic, photo: Camera, plan: Calendar,
};

const typeColors: Record<string, string> = {
  text: 'bg-blue-100 text-blue-700',
  voice: 'bg-purple-100 text-purple-700',
  photo: 'bg-green-100 text-green-700',
  plan: 'bg-orange-100 text-orange-700',
};

export default function NotesPage() {
  const { notes, folders, isLoading } = useNotes();
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const filtered = (notes || []).filter((n: any) => {
    if (activeType !== 'all' && n.type !== activeType) return false;
    if (selectedFolder && n.folderId !== selectedFolder) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Notes</h1>
        <Link href="/notes/new">
          <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2">
            <Plus className="w-4 h-4" />
            Create New Note
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveType(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeType === tab.id
                ? 'bg-[#1A3C5E] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <div className="flex gap-6">
        {/* Folder Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="hidden lg:block w-56 shrink-0"
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-[#1A3C5E] mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Folders
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                    !selectedFolder ? 'bg-[#1A3C5E]/10 text-[#1A3C5E] font-medium' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  All Folders
                </button>
                {(folders || []).map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                      selectedFolder === folder.id
                        ? 'bg-[#1A3C5E]/10 text-[#1A3C5E] font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {folder.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes List */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No notes found</h3>
              <p className="text-gray-500 mb-4">Start capturing your travel memories!</p>
              <Link href="/notes/new">
                <Button className="bg-[#E8733A] hover:bg-[#d4642e]">Create Your First Note</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {filtered.map((note: any, i: number) => {
                const Icon = typeIcons[note.type] || FileText;
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                            typeColors[note.type] || 'bg-gray-100 text-gray-700'
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-[#1A3C5E] truncate">{note.title}</h3>
                              <Button variant="ghost" size="icon" className="shrink-0 -mt-1">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{note.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge className={cn('text-xs', typeColors[note.type])}>
                                {note.type}
                              </Badge>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                              </span>
                              {note.tags?.length > 0 && (
                                <span className="text-xs text-gray-400">
                                  {note.tags.length} tags
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
