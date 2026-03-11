'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, FileText, Mic, Image, CheckSquare, Save, X, Tag, MapPin,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type NoteType = 'text' | 'voice' | 'photo' | 'plan';

interface NoteFormData {
  title: string;
  content: string;
  tags: string;
  tripId: string;
}

const noteTypes: { type: NoteType; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { type: 'text', label: 'Text', icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-200', desc: 'Write your thoughts' },
  { type: 'voice', label: 'Voice', icon: Mic, color: 'bg-red-50 text-red-600 border-red-200', desc: 'Record a voice memo' },
  { type: 'photo', label: 'Photo', icon: Image, color: 'bg-green-50 text-green-600 border-green-200', desc: 'Capture with photos' },
  { type: 'plan', label: 'Plan', icon: CheckSquare, color: 'bg-purple-50 text-purple-600 border-purple-200', desc: 'Create a checklist' },
];

const mockTrips = [
  { id: '1', title: 'Goa Beach Getaway' },
  { id: '2', title: 'Kerala Backwaters' },
  { id: '3', title: 'Rajasthan Heritage Tour' },
  { id: '4', title: 'Himachal Road Trip' },
];

export default function NewNotePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<NoteType>('text');
  const [tagList, setTagList] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<NoteFormData>({
    defaultValues: {
      title: '',
      content: '',
      tags: '',
      tripId: '',
    },
  });

  const onSubmit = (data: NoteFormData) => {
    const notePayload = {
      ...data,
      type: selectedType,
      tags: tagList,
    };
    console.log('Saving note:', notePayload);
    router.push('/notes');
  };

  const handleTagInput = (value: string) => {
    setValue('tags', value);
    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tagList.includes(newTag)) {
        setTagList([...tagList, newTag]);
      }
      setValue('tags', '');
    }
  };

  const removeTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/notes">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-[#1A3C5E]" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A3C5E]">New Note</h1>
          <p className="text-gray-500 text-sm">Capture your travel thoughts and memories</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Note Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-sm font-medium text-[#1A3C5E] mb-3 block">Note Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {noteTypes.map((nt, index) => (
              <motion.div
                key={nt.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedType(nt.type)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all text-center hover:shadow-md',
                    selectedType === nt.type
                      ? 'border-[#E8733A] bg-orange-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2',
                      nt.color
                    )}
                  >
                    <nt.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm text-[#1A3C5E]">{nt.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{nt.desc}</p>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm font-medium text-[#1A3C5E] mb-2 block">Title</label>
          <Input
            {...register('title', { required: 'Title is required' })}
            placeholder="Give your note a title..."
            className="text-lg border-gray-200 focus:border-[#E8733A] h-12"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="text-sm font-medium text-[#1A3C5E] mb-2 block">Content</label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            placeholder={
              selectedType === 'plan'
                ? 'Write your checklist items, one per line...'
                : 'Start writing your note...'
            }
            rows={12}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] resize-none bg-white placeholder:text-gray-400"
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
          )}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="text-sm font-medium text-[#1A3C5E] mb-2 block">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags
          </label>
          <div className="space-y-2">
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#1A3C5E]/10 text-[#1A3C5E] hover:bg-[#1A3C5E]/20 cursor-pointer gap-1 px-3 py-1"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}
            <Input
              value={watch('tags')}
              onChange={(e) => handleTagInput(e.target.value)}
              placeholder="Type tags separated by commas..."
              className="border-gray-200 focus:border-[#E8733A]"
            />
            <p className="text-xs text-gray-400">Press comma to add a tag</p>
          </div>
        </motion.div>

        {/* Trip Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-sm font-medium text-[#1A3C5E] mb-2 block">
            <MapPin className="w-4 h-4 inline mr-1" />
            Link to Trip
          </label>
          <select
            {...register('tripId')}
            className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
          >
            <option value="">Select a trip (optional)</option>
            {mockTrips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title}
              </option>
            ))}
          </select>
        </motion.div>

        <Separator />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 justify-end"
        >
          <Link href="/notes">
            <Button type="button" variant="ghost" className="gap-2 text-gray-600">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-[#E8733A] hover:bg-[#d4642e] gap-2 px-6"
          >
            <Save className="w-4 h-4" />
            Save Note
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
