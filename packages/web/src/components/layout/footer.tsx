'use client';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Separator } from '../ui/separator';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-primary dark:text-white">Partner</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm italic text-gray-400 dark:text-gray-500">
            Travel Together. Explore Beyond.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Partner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
