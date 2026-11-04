import React from 'react';

interface BrandIconProps {
  productKey?: string;
  name?: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function detectBrand(text: string): {
  id: string;
  label: string;
  bgGradient: string;
  borderColor: string;
} {
  const t = text.toLowerCase();

  if (t.includes('gemini') || t.includes('google')) {
    return {
      id: 'google',
      label: 'Google & Gemini',
      bgGradient: 'from-blue-500/10 via-red-500/10 to-amber-500/10',
      borderColor: 'border-blue-200 dark:border-blue-900',
    };
  }
  if (t.includes('outlook') || t.includes('hotmail') || t.includes('microsoft') || t.includes('office') || t.includes('windows')) {
    return {
      id: 'microsoft',
      label: 'Microsoft & Outlook',
      bgGradient: 'from-sky-500/15 to-blue-600/10',
      borderColor: 'border-sky-200 dark:border-sky-900',
    };
  }
  if (t.includes('chatgpt') || t.includes('openai') || t.includes('gpt')) {
    return {
      id: 'openai',
      label: 'OpenAI / ChatGPT',
      bgGradient: 'from-emerald-500/15 to-teal-600/10',
      borderColor: 'border-emerald-200 dark:border-emerald-900',
    };
  }
  if (t.includes('claude') || t.includes('anthropic')) {
    return {
      id: 'claude',
      label: 'Claude (Anthropic)',
      bgGradient: 'from-amber-500/15 to-orange-600/10',
      borderColor: 'border-amber-200 dark:border-amber-900',
    };
  }
  if (t.includes('netflix')) {
    return {
      id: 'netflix',
      label: 'Netflix',
      bgGradient: 'from-red-600/15 to-red-950/20',
      borderColor: 'border-red-200 dark:border-red-900',
    };
  }
  if (t.includes('spotify')) {
    return {
      id: 'spotify',
      label: 'Spotify',
      bgGradient: 'from-emerald-500/15 to-green-600/10',
      borderColor: 'border-green-200 dark:border-green-900',
    };
  }
  if (t.includes('canva')) {
    return {
      id: 'canva',
      label: 'Canva',
      bgGradient: 'from-cyan-500/15 to-blue-600/10',
      borderColor: 'border-cyan-200 dark:border-cyan-900',
    };
  }
  if (t.includes('adobe')) {
    return {
      id: 'adobe',
      label: 'Adobe',
      bgGradient: 'from-red-500/15 to-rose-600/10',
      borderColor: 'border-red-200 dark:border-red-900',
    };
  }
  if (t.includes('discord')) {
    return {
      id: 'discord',
      label: 'Discord',
      bgGradient: 'from-indigo-500/15 to-purple-600/10',
      borderColor: 'border-indigo-200 dark:border-indigo-900',
    };
  }
  if (t.includes('telegram')) {
    return {
      id: 'telegram',
      label: 'Telegram',
      bgGradient: 'from-sky-400/15 to-blue-500/10',
      borderColor: 'border-sky-200 dark:border-sky-900',
    };
  }
  if (t.includes('steam')) {
    return {
      id: 'steam',
      label: 'Steam',
      bgGradient: 'from-slate-700/20 to-slate-900/30',
      borderColor: 'border-slate-300 dark:border-slate-800',
    };
  }
  if (t.includes('youtube')) {
    return {
      id: 'youtube',
      label: 'YouTube',
      bgGradient: 'from-red-600/15 to-red-800/10',
      borderColor: 'border-red-200 dark:border-red-900',
    };
  }

  return {
    id: 'generic',
    label: 'Digital Product',
    bgGradient: 'from-lime-500/10 to-lime-600/5',
    borderColor: 'border-lime-200 dark:border-lime-900',
  };
}

export default function ProductBrandIcon({
  productKey = '',
  name = '',
  category = '',
  className = '',
  size = 'md',
}: BrandIconProps) {
  const combined = `${productKey} ${name} ${category}`;
  const brand = detectBrand(combined);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }[size];

  switch (brand.id) {
    case 'google':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 48 48" fill="none">
          <path
            fill="#4285F4"
            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
          />
          <path
            fill="#34A853"
            d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13.5 24 13.5c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.4 2 9.8 7.3 6.3 14.7z"
          />
          <path
            fill="#FBBC05"
            d="M24 46c5.9 0 11.1-2.2 15-5.9l-6.8-5.6c-2.3 1.5-5.2 2.5-8.2 2.5-6.1 0-11.2-3.8-13-9.1L4.3 32.7C7.8 40.5 15.3 46 24 46z"
          />
          <path
            fill="#EA4335"
            d="M44.5 20H24v8.5h11.8c-.8 2.5-2.4 4.6-4.5 6.1l6.8 5.6C42.2 36.4 45 30.6 45 24c0-1.3-.2-2.7-.5-4z"
          />
        </svg>
      );

    case 'microsoft':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 48 48" fill="none">
          {/* Outlook / Office modern blue envelope icon */}
          <rect x="4" y="8" width="40" height="32" rx="4" fill="#0078D4" />
          <path d="M4 14l20 13 20-13" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="24" r="8" fill="#106EBE" />
          <text x="18" y="28" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">O</text>
        </svg>
      );

    case 'openai':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.28 9.37a5.99 5.99 0 0 0-.52-4.94 6.06 6.06 0 0 0-6.14-2.92 6 6 0 0 0-4.67-2.36 6.05 6.05 0 0 0-5.74 4.19 6 6 0 0 0-4.11 3 6.04 6.04 0 0 0 .74 6.78 5.99 5.99 0 0 0 .52 4.94 6.06 6.06 0 0 0 6.14 2.92 6 6 0 0 0 4.67 2.36 6.05 6.05 0 0 0 5.74-4.19 6 6 0 0 0 4.11-3 6.04 6.04 0 0 0-.74-6.78zm-8.83 12.39a4.54 4.54 0 0 1-2.92-1.06l.16-.09 4.83-2.79a.77.77 0 0 0 .39-.67v-6.8l2.05 1.18v5.67a4.56 4.56 0 0 1-4.51 4.56zm-8.73-3.8a4.53 4.53 0 0 1-.56-3.07l.16.1 4.83 2.79a.76.76 0 0 0 .77 0l5.89-3.4v2.37l-4.91 2.83a4.56 4.56 0 0 1-6.18-1.62zm-1.39-8.4a4.53 4.53 0 0 1 2.36-2l-.01.18v5.58a.77.77 0 0 0 .38.67l5.89 3.4-2.05 1.18-4.91-2.84a4.56 4.56 0 0 1-1.66-6.17zm14.33 2.6l-5.89-3.4 2.05-1.18 4.91 2.84a4.56 4.56 0 0 1 1.66 6.17 4.53 4.53 0 0 1-2.35 2l.01-.18V12.8a.78.78 0 0 0-.39-.64zm2.14-3.23l-.16-.09-4.83-2.79a.77.77 0 0 0-.77 0l-5.89 3.4V7.28l4.91-2.84a4.56 4.56 0 0 1 6.74 4.69zm-9.8 4.38l-2.61-1.5 2.61-1.5 2.61 1.5-2.61 1.5z" />
        </svg>
      );

    case 'netflix':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="#E50914">
          <path d="M4 2v20l5-3V5l6 14V2l-5 3v14z" />
        </svg>
      );

    case 'spotify':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.713 1.115.295.18.388.563.208.856zm1.223-2.723c-.226.367-.707.482-1.074.256-2.687-1.652-6.785-2.131-9.965-1.166-.413.126-.85-.108-.975-.522-.125-.414.108-.85.522-.975 3.633-1.103 8.147-.568 11.236 1.332.367.227.482.708.256 1.075zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.017-.129-1.167-.623-.15-.495.13-1.017.624-1.167 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.444-.838.59-1.282.327z" />
        </svg>
      );

    case 'canva':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="#00C4CC">
          <circle cx="12" cy="12" r="10" />
          <path d="M15.5 14c-1.5 2-4 2.5-6 1.5s-2.5-4-1-6 4.5-2 6-1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'discord':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="#5865F2">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );

    case 'telegram':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="#229ED9">
          <circle cx="12" cy="12" r="10" />
          <path d="M17.5 7.5l-2.5 10c-.1.4-.4.5-.7.3l-2.6-1.9-1.3 1.2c-.2.2-.3.3-.6.3l.2-2.7 4.9-4.4c.2-.2 0-.3-.3-.1l-6.1 3.8-2.6-.8c-.6-.2-.6-.6.1-.8l10.2-3.9c.5-.2.9.1.7.9z" fill="#ffffff" />
        </svg>
      );

    case 'steam':
      return (
        <svg className={`${sizeClasses} ${className}`} viewBox="0 0 24 24" fill="#1b2838">
          <circle cx="12" cy="12" r="10" />
          <path d="M8.5 13.5l3.5 1.5 2.5-2.5-1-1.5-3.5-1.5z" fill="#66c0f4" />
          <circle cx="14.5" cy="10.5" r="2" fill="#ffffff" />
        </svg>
      );

    default:
      return (
        <div className={`flex items-center justify-center rounded-xl bg-lime-400/20 text-lime-600 font-extrabold ${sizeClasses} ${className}`}>
          <svg className="h-2/3 w-2/3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      );
  }
}
