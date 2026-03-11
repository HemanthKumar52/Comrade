'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, Users, Trophy, FileText, Globe, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/layout/footer';

const features = [
  {
    icon: Map,
    title: 'Smart Maps',
    description: 'Navigate with stunning 3D and 2D maps with real-time route tracking and terrain views.',
  },
  {
    icon: Users,
    title: 'Find Partners',
    description: 'Connect with verified travelers heading your way. Travel together, stay safe.',
  },
  {
    icon: Trophy,
    title: 'Earn Badges',
    description: 'Unlock achievements as you explore. Level up from Wanderer to Legend.',
  },
  {
    icon: FileText,
    title: 'Travel Notes',
    description: 'Capture memories with text, voice, and photo notes pinned to your routes.',
  },
  {
    icon: Globe,
    title: 'Cultural Intel',
    description: 'Learn local customs, etiquette, and phrases before you arrive.',
  },
  {
    icon: ShieldAlert,
    title: 'Safety Hub',
    description: 'SOS alerts, embassy locator, and real-time travel advisories at your fingertips.',
  },
];

const stats = [
  { label: 'Travelers', target: 10000, suffix: '+' },
  { label: 'Trips', target: 50000, suffix: '+' },
  { label: 'Badges Earned', target: 100000, suffix: '+' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}K` : count;

  return (
    <div ref={ref} className="text-4xl font-bold text-white">
      {formatted}{suffix}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A3C5E] to-[#0f2337] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#E8733A] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E8733A] rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
          >
            Travel Together.
            <br />
            <span className="text-[#E8733A]">Explore Beyond.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Your intelligent travel companion with smart maps, partner matching,
            gamified achievements, and everything you need for the journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-[#E8733A] hover:bg-[#d4642e] text-white px-8 py-6 text-lg">
                Start Exploring
              </Button>
            </Link>
            <Link href="/partners">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Find Partners
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A3C5E]">
              Everything You Need to Travel Smart
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              From planning to exploring, Partner has you covered with powerful tools and a vibrant community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-[#E8733A]/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-[#E8733A]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A3C5E] mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-[#1A3C5E] to-[#0f2337]">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <p className="mt-2 text-white/70 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
