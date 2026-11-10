// ============================================================
// Catalog Filter — what the store is willing to list
// ============================================================

/**
 * Never listed, from any supplier: stolen session cookies, SMS/OTP numbers
 * for bypassing verification, aged or bulk accounts, credential checkers,
 * leaked configs, fraud "methods", tooling built for abuse, and resold API
 * keys or credits, which are typically far below the official price.
 */
const BLOCKED_NAME =
  /cookie|s\W?m\W?s|panel|\bnum\b|\botp\b|verification number|number rental|checker|\b(old|aged)\b|bulk|random ip|followers|live studio|^gmail|^icloud|apple id|twitter|tiktok|discord account|telegram account|tg acc|t\/g acc|gpm login|antidetect|f.?rebase|\bscripts?\b|source code|\bbot\b|adsbot|method|json|group|private channel|only.?fan|steam acc|instagram|edu mail|credit account|cloud credit|genrat|generat|\bapi\b|admin dashboard/i;

/**
 * Every supplier is a marketplace that mixes in such goods, so only these
 * brands are listed. A new product from an unknown brand stays hidden.
 */
const ALLOWED_BRANDS =
  /netflix|spotify|youtube premium|crunchyroll|ᴄʀᴜɴᴄʜʏʀᴏʟʟ|apple (music|tv)|prime video|amazon prime|zee ?5|sonyliv|nord ?vpn|surfshark|proton|\bhma\b|expressvpn|adguard|ipvanish|norton|purevpn|kaspersky|zoom|notion|canva|figma|grammarly|capcut|microsoft 365|office 365|office professional|windows 1[01]|copilot|adobe|autodesk|coreldraw|coursera|udemy|edx|linkedin|duolingo|jetbrains|ilovepdf|scribd|kahoot|skillshare|memrise|quizlet|wordwall|chat ?gpt|perplexity|kimi (plus|pro)|google ai|gemini|cursor|lovable|replit|framer|railway|n8n|manus|runway|kling|leonardo|elevenlabs|eleven reader|higgsfield|photoroom|suno|genspark|meshy|dreamina|pollo ai|pippit|pixverse|brain\.fm|headspace|meitu|beautycam|xingtu|alight motion|miro|airtable|magic patterns|bolt pro|bolt\.new|wink|customer\.io|resend|chatprd|muse ai|wispr|factory pro|rotating proxy|outlook|hotmail|snapchat|telegram premium|grok|arize|gamma|warp build|descript|fin ia|intercom|linear business|pangram|granola|jam team|mobbin|readwise|posthog|supercut|mercury personal|p\W?rn hub/i;

/** Sold as subscriptions, but the description points to stolen sessions or cards. */
const BLOCKED_DESCRIPTION = /cookie|attached card|different card|chargebacks/i;

export function isBlockedProduct(name: string, description = ''): boolean {
  return BLOCKED_NAME.test(name) || BLOCKED_DESCRIPTION.test(description);
}

export function isAllowedBrand(name: string): boolean {
  return ALLOWED_BRANDS.test(name);
}

/** The single check every supplier's catalog goes through. */
export function isListable(name: string, description = ''): boolean {
  const clean = name.normalize('NFKC');
  return isAllowedBrand(clean) && !isBlockedProduct(clean, description);
}
