'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, MessageSquare, MoreVertical, Paperclip, Smile, Phone, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn, getInitials } from '@/lib/utils';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

const mockRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    lastMessage: 'See you at the meetup point!',
    time: '2m ago',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Priya Nair',
    lastMessage: 'The trail was amazing! Loved every bit of it.',
    time: '1h ago',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Arjun Das',
    lastMessage: 'Can you share the route map?',
    time: '3h ago',
    unread: 1,
    online: false,
  },
];

const mockMessagesByRoom: Record<string, Message[]> = {
  '1': [
    { id: '1', sender: 'other', text: 'Hey! Are you still planning the Munnar trip?', time: '10:30 AM' },
    { id: '2', sender: 'me', text: 'Yes! I was thinking next weekend. Are you in?', time: '10:32 AM' },
    { id: '3', sender: 'other', text: 'Absolutely! Should we take the scenic route through Adimali?', time: '10:33 AM' },
    { id: '4', sender: 'me', text: 'Definitely. I\'ll plan the route on the map tonight.', time: '10:35 AM' },
    { id: '5', sender: 'other', text: 'Perfect. I\'ll bring my camera for the tea gardens.', time: '10:36 AM' },
    { id: '6', sender: 'me', text: 'Great idea! Let\'s meet at the usual spot.', time: '10:38 AM' },
    { id: '7', sender: 'other', text: 'See you at the meetup point!', time: '10:40 AM' },
  ],
  '2': [
    { id: '1', sender: 'other', text: 'Just got back from the Wayanad trek!', time: '9:00 AM' },
    { id: '2', sender: 'me', text: 'How was it? I\'ve been wanting to go there.', time: '9:05 AM' },
    { id: '3', sender: 'other', text: 'The trail was amazing! Loved every bit of it.', time: '9:10 AM' },
  ],
  '3': [
    { id: '1', sender: 'me', text: 'I mapped out a new route through the Western Ghats.', time: '2:00 PM' },
    { id: '2', sender: 'other', text: 'That sounds awesome! Is it bikeable?', time: '2:15 PM' },
    { id: '3', sender: 'me', text: 'Yep, mostly paved with some gravel sections.', time: '2:20 PM' },
    { id: '4', sender: 'other', text: 'Can you share the route map?', time: '2:30 PM' },
  ],
};

export default function MessagesPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentRoom = mockRooms.find((r) => r.id === selectedRoom);
  const currentMessages = selectedRoom ? mockMessagesByRoom[selectedRoom] || [] : [];

  const filteredRooms = mockRooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex rounded-xl border bg-white overflow-hidden shadow-sm"
      >
        {/* Left Panel: Chat List */}
        <div
          className={cn(
            'w-full md:w-80 border-r flex flex-col bg-gray-50/50',
            selectedRoom ? 'hidden md:flex' : 'flex'
          )}
        >
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl font-bold text-[#1A3C5E] mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredRooms.map((room, index) => (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRoom(room.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 hover:bg-white transition-all text-left border-b border-gray-100',
                  selectedRoom === room.id && 'bg-white border-l-2 border-l-[#E8733A]'
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="w-11 h-11 bg-[#1A3C5E]">
                    <AvatarFallback className="bg-[#1A3C5E] text-white text-sm font-medium">
                      {getInitials(room.name)}
                    </AvatarFallback>
                  </Avatar>
                  {room.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-[#1A3C5E] truncate">{room.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{room.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage}</p>
                </div>
                {room.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#E8733A] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                    {room.unread}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Panel: Chat Area */}
        <div
          className={cn(
            'flex-1 flex flex-col bg-white',
            !selectedRoom ? 'hidden md:flex' : 'flex'
          )}
        >
          {!selectedRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No conversation selected</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Select a conversation from the list to start chatting with your travel partners
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b bg-white">
                <button
                  className="md:hidden text-gray-500"
                  onClick={() => setSelectedRoom(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="relative">
                  <Avatar className="w-10 h-10 bg-[#1A3C5E]">
                    <AvatarFallback className="bg-[#1A3C5E] text-white text-sm font-medium">
                      {getInitials(currentRoom?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  {currentRoom?.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1A3C5E]">{currentRoom?.name}</p>
                  <p className="text-xs text-green-500">
                    {currentRoom?.online ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A3C5E]">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A3C5E]">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A3C5E]">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#f8f9fb]">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border">
                    Today
                  </span>
                </div>
                {currentMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn('flex', msg.sender === 'me' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm',
                        msg.sender === 'me'
                          ? 'bg-[#1A3C5E] text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className={cn(
                          'text-[10px] mt-1 text-right',
                          msg.sender === 'me' ? 'text-white/50' : 'text-gray-400'
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A3C5E] shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-gray-50 border-gray-200 rounded-full px-4"
                  />
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A3C5E] shrink-0">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="bg-[#E8733A] hover:bg-[#d4642e] rounded-full shrink-0"
                    disabled={!messageInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
