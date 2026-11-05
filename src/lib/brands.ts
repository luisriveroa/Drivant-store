// ============================================================
// Brand Catalog — logo, display name and category of each brand
// ============================================================

export interface StoreCategory {
  id: string;
  name: string;
}

export const CATEGORIES: StoreCategory[] = [
  { id: 'streaming', name: 'Streaming y música' },
  { id: 'ia', name: 'Inteligencia artificial' },
  { id: 'diseno', name: 'Diseño y video' },
  { id: 'productividad', name: 'Oficina y productividad' },
  { id: 'educacion', name: 'Educación' },
  { id: 'desarrollo', name: 'Desarrollo' },
  { id: 'vpn', name: 'VPN y seguridad' },
  { id: 'redes', name: 'Redes sociales' },
  { id: 'adultos', name: 'Adultos' },
  { id: 'otros', name: 'Otros' },
];

export interface Brand {
  id: string;
  name: string;
  categoryId: string;
  match: RegExp;
  /** File in /public/brands. Without one, the brand shows its initials. */
  logo?: string;
}

// Order matters: the first match wins, so bundles and specific products go first.
export const BRANDS: Brand[] = [
  { id: 'cursor', name: 'Cursor', categoryId: 'desarrollo', match: /cursor/i, logo: 'cursor.svg' },
  { id: 'elevenlabs', name: 'ElevenLabs', categoryId: 'ia', match: /eleven ?labs|eleven reader/i, logo: 'elevenlabs.svg' },
  { id: 'youtube', name: 'YouTube Premium', categoryId: 'streaming', match: /youtube/i, logo: 'youtube.svg' },
  { id: 'netflix', name: 'Netflix', categoryId: 'streaming', match: /netflix/i, logo: 'netflix.svg' },
  { id: 'spotify', name: 'Spotify', categoryId: 'streaming', match: /spotify/i, logo: 'spotify.svg' },
  { id: 'crunchyroll', name: 'Crunchyroll', categoryId: 'streaming', match: /crunchy ?roll/i, logo: 'crunchyroll.svg' },
  { id: 'apple-music', name: 'Apple Music', categoryId: 'streaming', match: /apple music/i, logo: 'apple-music.svg' },
  { id: 'apple-tv', name: 'Apple TV', categoryId: 'streaming', match: /apple tv/i, logo: 'apple-tv.svg' },
  { id: 'prime-video', name: 'Prime Video', categoryId: 'streaming', match: /prime videos?/i, logo: 'prime-video.png' },
  { id: 'amazon', name: 'Amazon Prime', categoryId: 'streaming', match: /amazon prime/i, logo: 'amazon.svg' },
  { id: 'zee5', name: 'ZEE5', categoryId: 'streaming', match: /zee ?5/i, logo: 'zee5.png' },
  { id: 'sonyliv', name: 'SonyLIV', categoryId: 'streaming', match: /sony ?liv/i, logo: 'sonyliv.png' },

  { id: 'openai', name: 'ChatGPT', categoryId: 'ia', match: /chat ?gpt|openai/i, logo: 'openai.svg' },
  { id: 'gemini', name: 'Gemini', categoryId: 'ia', match: /gemini/i, logo: 'gemini.svg' },
  { id: 'google', name: 'Google AI', categoryId: 'ia', match: /google/i, logo: 'google.svg' },
  { id: 'grok', name: 'Grok', categoryId: 'ia', match: /grok/i, logo: 'grok.svg' },
  { id: 'higgsfield', name: 'Higgsfield', categoryId: 'ia', match: /higgsfield/i, logo: 'higgsfield.svg' },
  { id: 'kling', name: 'Kling AI', categoryId: 'ia', match: /kling/i, logo: 'kling.png' },
  { id: 'leonardo', name: 'Leonardo AI', categoryId: 'ia', match: /leonardo/i, logo: 'leonardo.png' },
  { id: 'manus', name: 'Manus', categoryId: 'ia', match: /manus/i, logo: 'manus.png' },
  { id: 'runway', name: 'Runway', categoryId: 'ia', match: /runway/i, logo: 'runway.svg' },
  { id: 'wispr', name: 'Wispr Flow', categoryId: 'ia', match: /wispr/i, logo: 'wispr.png' },
  { id: 'muse', name: 'Muse AI', categoryId: 'ia', match: /muse ?ai/i },
  { id: 'chatprd', name: 'ChatPRD', categoryId: 'ia', match: /chatprd/i, logo: 'chatprd.png' },
  { id: 'gamma', name: 'Gamma', categoryId: 'ia', match: /gamma/i, logo: 'gamma.svg' },
  { id: 'granola', name: 'Granola', categoryId: 'ia', match: /granola/i, logo: 'granola.png' },
  { id: 'fin', name: 'Fin AI', categoryId: 'ia', match: /\bfin\b/i, logo: 'fin.svg' },

  { id: 'canva', name: 'Canva', categoryId: 'diseno', match: /canva/i, logo: 'canva.png' },
  { id: 'figma', name: 'Figma', categoryId: 'diseno', match: /figma/i, logo: 'figma.svg' },
  { id: 'adobe', name: 'Adobe Express', categoryId: 'diseno', match: /adobe/i, logo: 'adobe.svg' },
  { id: 'capcut', name: 'CapCut', categoryId: 'diseno', match: /cap ?cut/i, logo: 'capcut.svg' },
  { id: 'autodesk', name: 'Autodesk', categoryId: 'diseno', match: /autodesk/i, logo: 'autodesk.svg' },
  { id: 'framer', name: 'Framer', categoryId: 'diseno', match: /framer/i, logo: 'framer.svg' },
  { id: 'descript', name: 'Descript', categoryId: 'diseno', match: /descript/i, logo: 'descript.svg' },
  { id: 'supercut', name: 'Supercut', categoryId: 'diseno', match: /supercut/i, logo: 'supercut.png' },
  { id: 'photoroom', name: 'Photoroom', categoryId: 'diseno', match: /photoroom/i, logo: 'photoroom.png' },
  { id: 'wink', name: 'Wink', categoryId: 'diseno', match: /\bwink\b/i, logo: 'wink.png' },
  { id: 'mobbin', name: 'Mobbin', categoryId: 'diseno', match: /mobbin/i, logo: 'mobbin.png' },
  { id: 'magic-patterns', name: 'Magic Patterns', categoryId: 'diseno', match: /magic patterns/i, logo: 'magic-patterns.svg' },

  { id: 'outlook', name: 'Outlook', categoryId: 'productividad', match: /outlook|hotmail/i, logo: 'outlook.svg' },
  { id: 'office', name: 'Microsoft 365', categoryId: 'productividad', match: /office ?365|microsoft ?365/i, logo: 'office.svg' },
  { id: 'windows', name: 'Windows', categoryId: 'productividad', match: /windows/i, logo: 'windows.svg' },
  { id: 'notion', name: 'Notion', categoryId: 'productividad', match: /notion/i, logo: 'notion.svg' },
  { id: 'airtable', name: 'Airtable', categoryId: 'productividad', match: /airtable/i, logo: 'airtable.svg' },
  { id: 'zoom', name: 'Zoom', categoryId: 'productividad', match: /zoom/i, logo: 'zoom.svg' },
  { id: 'grammarly', name: 'Grammarly', categoryId: 'productividad', match: /grammarly/i, logo: 'grammarly.svg' },
  { id: 'ilovepdf', name: 'iLovePDF', categoryId: 'productividad', match: /ilovepdf/i, logo: 'ilovepdf.svg' },
  { id: 'miro', name: 'Miro', categoryId: 'productividad', match: /\bmiro\b/i, logo: 'miro.svg' },
  { id: 'readwise', name: 'Readwise', categoryId: 'productividad', match: /readwise/i, logo: 'readwise.png' },
  { id: 'jam', name: 'Jam', categoryId: 'productividad', match: /\bjam\b/i, logo: 'jam.png' },
  { id: 'mercury', name: 'Mercury', categoryId: 'productividad', match: /mercury/i, logo: 'mercury.png' },
  { id: 'linkedin', name: 'LinkedIn Premium', categoryId: 'productividad', match: /linkedin/i, logo: 'linkedin.svg' },

  { id: 'coursera', name: 'Coursera', categoryId: 'educacion', match: /coursera/i, logo: 'coursera.svg' },
  { id: 'udemy', name: 'Udemy', categoryId: 'educacion', match: /udemy/i, logo: 'udemy.svg' },
  { id: 'edx', name: 'edX', categoryId: 'educacion', match: /\bedx\b/i, logo: 'edx.svg' },
  { id: 'duolingo', name: 'Duolingo', categoryId: 'educacion', match: /duolingo/i, logo: 'duolingo.svg' },
  { id: 'quizlet', name: 'Quizlet', categoryId: 'educacion', match: /quizlet/i, logo: 'quizlet.svg' },
  { id: 'wordwall', name: 'Wordwall', categoryId: 'educacion', match: /wordwall/i, logo: 'wordwall.png' },

  { id: 'replit', name: 'Replit', categoryId: 'desarrollo', match: /replit/i, logo: 'replit.svg' },
  { id: 'lovable', name: 'Lovable', categoryId: 'desarrollo', match: /lovable/i, logo: 'lovable.svg' },
  { id: 'bolt', name: 'Bolt', categoryId: 'desarrollo', match: /\bbolt\b/i, logo: 'bolt.svg' },
  { id: 'railway', name: 'Railway', categoryId: 'desarrollo', match: /railway/i, logo: 'railway.svg' },
  { id: 'n8n', name: 'n8n', categoryId: 'desarrollo', match: /n8n/i, logo: 'n8n.svg' },
  { id: 'jetbrains', name: 'JetBrains', categoryId: 'desarrollo', match: /jetbrains/i, logo: 'jetbrains.svg' },
  { id: 'warp', name: 'Warp', categoryId: 'desarrollo', match: /\bwarp\b/i, logo: 'warp.svg' },
  { id: 'resend', name: 'Resend', categoryId: 'desarrollo', match: /resend/i, logo: 'resend.svg' },
  { id: 'posthog', name: 'PostHog', categoryId: 'desarrollo', match: /posthog/i, logo: 'posthog.svg' },
  { id: 'customerio', name: 'Customer.io', categoryId: 'desarrollo', match: /customer\.io/i, logo: 'customerio.svg' },
  { id: 'arize', name: 'Arize', categoryId: 'desarrollo', match: /arize/i, logo: 'arize.png' },
  { id: 'factory', name: 'Factory', categoryId: 'desarrollo', match: /factory/i, logo: 'factory.png' },

  { id: 'nordvpn', name: 'NordVPN', categoryId: 'vpn', match: /nord ?vpn/i, logo: 'nordvpn.svg' },
  { id: 'surfshark', name: 'Surfshark', categoryId: 'vpn', match: /surfshark/i, logo: 'surfshark.svg' },
  { id: 'proton', name: 'Proton VPN', categoryId: 'vpn', match: /proton/i, logo: 'proton.svg' },
  { id: 'hma', name: 'HMA VPN', categoryId: 'vpn', match: /\bhma\b/i, logo: 'hma.png' },
  { id: 'proxy', name: 'Proxies', categoryId: 'vpn', match: /proxy/i },

  { id: 'snapchat', name: 'Snapchat+', categoryId: 'redes', match: /snapchat/i, logo: 'snapchat.svg' },
  { id: 'pornhub', name: 'Pornhub', categoryId: 'adultos', match: /p\W?rn ?hub/i, logo: 'pornhub.png' },
];

const OTHER_BRAND: Brand = { id: 'otros', name: 'Producto digital', categoryId: 'otros', match: /$^/ };

export function detectBrand(name: string): Brand {
  return BRANDS.find((b) => b.match.test(name)) || OTHER_BRAND;
}

export function getCategoryName(categoryId: string): string {
  return CATEGORIES.find((c) => c.id === categoryId)?.name || 'Otros';
}
