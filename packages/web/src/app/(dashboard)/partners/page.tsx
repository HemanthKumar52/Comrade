'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, UserPlus, Check, X, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import PartnerSearchFilters from '@/components/social/partner-search-filters';
import { usePartners } from '@/hooks/usePartners';
import { cn, getInitials } from '@/lib/utils';

const tabs = ['Search', 'Sent Requests', 'Received Requests'] as const;

export default function PartnersPage() {
  const { partners, sentRequests, receivedRequests, isLoading } = usePartners();
  const [activeTab, setActiveTab] = useState<string>('Search');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentList =
    activeTab === 'Sent Requests'
      ? sentRequests || []
      : activeTab === 'Received Requests'
      ? receivedRequests || []
      : partners || [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Find Travel Partners</h1>
        <p className="text-gray-500 text-sm">Connect with verified travelers heading your way</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab
                ? 'bg-[#1A3C5E] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            )}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Filters */}
      {activeTab === 'Search' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by destination or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          {showFilters && <PartnerSearchFilters />}
        </motion.div>
      )}

      {/* Partner Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-40" /></CardContent></Card>
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-16">
          <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {activeTab === 'Search' ? 'No partners found' :
             activeTab === 'Sent Requests' ? 'No sent requests' : 'No pending requests'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'Search'
              ? 'Try adjusting your filters to find travel partners.'
              : 'Your requests will appear here.'}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {currentList.map((partner: any, i: number) => (
            <motion.div
              key={partner.id || partner.userId || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12 bg-[#1A3C5E] text-white flex items-center justify-center font-medium">
                      <span>{getInitials(partner.name || 'User')}</span>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link href={`/partners/${partner.userId || partner.id}`}>
                        <h3 className="font-semibold text-[#1A3C5E] hover:underline truncate">
                          {partner.name || 'Traveler'}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{partner.rating || 4.5}</span>
                        <span>Level: {partner.level || 'Explorer'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{partner.destination || 'Anywhere'}</span>
                  </div>
                  <Separator className="mb-4" />
                  <div className="flex gap-2">
                    {activeTab === 'Search' && (
                      <Button size="sm" className="flex-1 bg-[#E8733A] hover:bg-[#d4642e] gap-1">
                        <UserPlus className="w-3 h-3" />
                        Connect
                      </Button>
                    )}
                    {activeTab === 'Received Requests' && (
                      <>
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 gap-1">
                          <Check className="w-3 h-3" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <X className="w-3 h-3" />
                          Decline
                        </Button>
                      </>
                    )}
                    {activeTab === 'Sent Requests' && (
                      <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
