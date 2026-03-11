'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TripPlanner from '@/components/trips/trip-planner';

export default function NewTripPage() {
  const router = useRouter();

  const handleSubmit = async (tripData: any) => {
    // Create trip via API, then navigate
    // const trip = await createTrip(tripData);
    const tripId = tripData.id || 'new';
    router.push(`/trips/${tripId}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/trips">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A3C5E]">Plan a New Trip</h1>
          <p className="text-gray-500 text-sm">Set up your journey details</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TripPlanner onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}
