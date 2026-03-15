'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Car,
  ChevronLeft,
  CircleAlert,
  Cloud,
  Compass,
  DollarSign,
  FileText,
  Flag,
  Globe,
  Heart,
  LayoutDashboard,
  Languages,
  Leaf,
  MapPin,
  MessageCircle,
  Mountain,
  Navigation,
  Package,
  PartyPopper,
  PlusCircle,
  Route,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Stamp,
  Star,
  Users,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'EXPLORE',
    items: [
      { label: 'Home', href: '/', icon: LayoutDashboard },
      { label: 'Map', href: '/map', icon: MapPin },
      { label: 'Discover', href: '/discover', icon: Compass },
      { label: 'Places', href: '/places', icon: Mountain },
      { label: 'Weather', href: '/weather', icon: Cloud },
      { label: 'Air Quality', href: '/air-quality', icon: Wind },
      { label: 'Safety', href: '/safety', icon: ShieldCheck },
    ],
  },
  {
    title: 'TRIPS',
    items: [
      { label: 'My Trips', href: '/trips', icon: Route },
      { label: 'Plan Trip', href: '/trips/plan', icon: PlusCircle },
      { label: 'Active Trip', href: '/trips/active', icon: Navigation },
    ],
  },
  {
    title: 'SOCIAL',
    items: [
      { label: 'Partners', href: '/partners', icon: Users },
      { label: 'Messages', href: '/messages', icon: MessageCircle },
      { label: 'Reviews', href: '/reviews', icon: Star },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Notes', href: '/notes', icon: FileText },
      { label: 'Translator', href: '/translator', icon: Languages },
      { label: 'Currency', href: '/currency', icon: DollarSign },
      { label: 'Packing', href: '/packing', icon: Package },
      { label: 'Vehicles', href: '/vehicles', icon: Car },
      { label: 'Phrasebook', href: '/phrases', icon: BookOpen },
      { label: 'Traffic Rules', href: '/traffic', icon: CircleAlert },
    ],
  },
  {
    title: 'DISCOVER',
    items: [
      { label: 'Country Info', href: '/country-info', icon: Flag },
      { label: 'Travel Guides', href: '/travel-guides', icon: BookOpen },
      { label: 'Holidays', href: '/holidays', icon: PartyPopper },
      { label: 'Events', href: '/events', icon: Calendar },
      { label: 'Cultural', href: '/cultural', icon: Globe },
    ],
  },
  {
    title: 'SAFETY',
    items: [
      { label: 'Emergency', href: '/emergency', icon: AlertTriangle },
      { label: 'Health', href: '/health', icon: Heart },
      { label: 'Advisories', href: '/advisories', icon: Shield },
      { label: 'Disaster Alerts', href: '/disaster-alerts', icon: Activity },
    ],
  },
  {
    title: 'MORE',
    items: [
      { label: 'AI Planner', href: '/ai', icon: Sparkles },
      { label: 'Carbon', href: '/carbon', icon: Leaf },
      { label: 'Analytics', href: '/stats', icon: BarChart3 },
      { label: 'Badges', href: '/badges', icon: Award },
      { label: 'Passport', href: '/passport', icon: Stamp },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 overflow-y-auto scrollbar-thin',
          collapsed ? 'w-16' : 'w-64',
          // Mobile: slide in/out
          'max-lg:-translate-x-full max-lg:shadow-xl',
          open && 'max-lg:translate-x-0'
        )}
      >
        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-300',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2 pb-4">
          {navSections.map((section) => (
            <div key={section.title} className="mt-4 first:mt-0">
              {!collapsed && (
                <p className="mb-1 px-3 text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                  {section.title}
                </p>
              )}
              {collapsed && <div className="mb-1 mx-auto w-6 h-px bg-gray-200 dark:bg-gray-700" />}

              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const linkContent = (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-accent')} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                }

                return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
              })}
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
