// ============================================================
// Catalog Filter — what the store is willing to list
// ============================================================

/**
 * Never listed, from any supplier: stolen session cookies, SMS/OTP panels,
 * bulk or pre-logged social accounts, leaked configs, fraud "methods" and
 * tooling built for abuse.
 */
const BLOCKED_NAME =
  /cookie|s\W?m\W?s|panel|\bnum\b|tg acc|t\/g acc|f.?rebase|\bscripts?\b|source code|\bbot\b|adsbot|method|json|group|private channel|only.?fan|steam acc|instagram|edu mail|credit account|cloud credit|genrat|generat|api[ -]?(claude|codex|kimi|deepseek|cursor)|\bapi\b.*(claude|codex)|(claude|codex).*\bapi\b|api test|admin dashboard/i;

/** Marketplaces that mix in such goods: only these brands are listed from them. */
const ALLOWED_BRANDS =
  /netflix|spotify|youtube premium|crunchyroll|ᴄʀᴜɴᴄʜʏʀᴏʟʟ|apple (music|tv)|prime video|amazon prime|zee ?5|sonyliv|nord ?vpn|surfshark|proton vpn|\bhma\b|zoom|notion|canva|figma|grammarly|capcut|microsoft 365|office 365|windows 11|adobe|autodesk|coursera|udemy|edx|linkedin|duolingo|jetbrains|ilovepdf|chatgpt plus|google ai|gemini|cursor ?pro|lovable|replit|framer|railway|n8n|manus|runway|kling|leonardo|elevenlabs|higgsfield|photoroom|miro|airtable|magic patterns|bolt pro|bolt\.new|wink|customer\.io|resend|chatprd|muse ai|wispr|factory pro|rotating proxy|emails? outlook|outlook private|snapchat|grok|arize|gamma ai|warp build|wordwall|quizlet|descript|fin ia|granola|jam team|mobbin|readwise|posthog|supercut|eleven reader|mercury personal|p\W?rn hub/i;

/** Sold as subscriptions, but the description points to stolen sessions or cards. */
const BLOCKED_DESCRIPTION = /cookie|attached card|different card|chargebacks/i;

export function isBlockedProduct(name: string, description = ''): boolean {
  return BLOCKED_NAME.test(name) || BLOCKED_DESCRIPTION.test(description);
}

export function isAllowedBrand(name: string): boolean {
  return ALLOWED_BRANDS.test(name);
}
