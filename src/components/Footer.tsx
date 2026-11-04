import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Branding */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Zap className="h-4 w-4 text-brand-600" />
            <span>
              Powered by{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                QuantumStore
              </span>
            </span>
            <span className="mx-1">·</span>
            <span>&copy; {currentYear}</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
