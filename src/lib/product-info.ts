// ============================================================
// Product Info — turns a supplier's product into the same Spanish
// structure for every product in the store
// ============================================================
import { PRODUCT_DETAILS } from '@/data/product-details';
import { detectBrand, getCategoryName } from '@/lib/brands';
import { normalizeForSearch } from '@/lib/search';
import type { ProductInfo } from '@/lib/types';

const SMALL_CAPS: Record<string, string> = { ᴀ: 'a', ʙ: 'b', ᴄ: 'c', ᴅ: 'd', ᴇ: 'e', ғ: 'f', ɢ: 'g', ʜ: 'h', ɪ: 'i', ᴊ: 'j', ᴋ: 'k', ʟ: 'l', ᴍ: 'm', ɴ: 'n', ᴏ: 'o', ᴘ: 'p', ʀ: 'r', ᴛ: 't', ᴜ: 'u', ᴠ: 'v', ᴡ: 'w', ʏ: 'y', ᴢ: 'z' };

const DECORATION = new RegExp('[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\uFE0F\\u200D]', 'gu');

const plural = (n: string, one: string, many: string) => `${n} ${Number(n) === 1 ? one : many}`;

function stripDecoration(name: string): string {
  return name
    .normalize('NFKC')
    .replace(/[ᴀ-ᴢʀʏʜʟɪɴɢғ]/g, (c) => SMALL_CAPS[c] || c)
    .replace(DECORATION, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseWarranty(text: string): string | null {
  const span = text.match(/(\d+)[\s-]*(day|hour|month|year)s?[\s-]*warranty/i);
  if (span) {
    const unit = span[2].toLowerCase();
    const [one, many] =
      unit === 'day' ? ['día', 'días'] : unit === 'hour' ? ['hora', 'horas'] : unit === 'month' ? ['mes', 'meses'] : ['año', 'años'];
    return plural(span[1], one, many);
  }
  if (/login warranty only/i.test(text)) return 'Solo del acceso';
  if (/redeem warranty only/i.test(text)) return 'Solo para el canje';
  const days = text.match(/\(?\bW(\d+)(D|H)\)?/i) || text.match(/(\d+)\s*(d|days?)\s*warranty/i) || text.match(/warranty\s*(\d+)\s*(d)\b/i);
  if (days) {
    const n = days[1];
    return /h/i.test(days[2]) ? plural(n, 'hora', 'horas') : plural(n, 'día', 'días');
  }
  if (/\bnon?[ -]?warranty\b|\bno warranty\b|\bnw\b/i.test(text)) return 'Sin garantía';
  if (/\bfull warranty\b|\bfw\b/i.test(text)) return 'Completa';
  return null;
}

function parseDuration(text: string): string | null {
  if (/lifetime/i.test(text)) return 'De por vida';
  const range = text.match(/\b(\d+)\s*-\s*(\d+)\s*(d|days?)\b/i);
  if (range) return `${range[1]} a ${range[2]} días`;
  const m =
    text.match(/\b(\d+)\s*-?\s*(months?|mon|yrs?|years?|days?)\b/i) ||
    // Compact forms such as 12M or 3Y. Not followed by more digits or a unit like "M Token".
    text.match(/\b(\d+)\s*(m|y)\b(?!\s*(token|cr))/i) ||
    text.match(/\b(\d+)\s*(d)\b(?!\s*warranty)/i);
  if (!m) return null;
  const unit = m[2].toLowerCase();
  if (unit.startsWith('m')) return plural(m[1], 'mes', 'meses');
  if (unit.startsWith('y')) return plural(m[1], 'año', 'años');
  return plural(m[1], 'día', 'días');
}

function parseDelivery(text: string): string | null {
  if (/\bkey\b|retail/i.test(text)) return 'Clave de activación';
  if (/coupon|cupon|redeem/i.test(text)) return 'Cupón';
  if (/\blink\b/i.test(text)) return 'Enlace de activación';
  if (/invit/i.test(text)) return 'Invitación a tu correo';
  if (/on ?(your )?mail/i.test(text)) return 'Se activa en tu correo';
  if (/on your (acc|account)/i.test(text)) return 'Se activa en tu cuenta';
  if (/pre[- ]?made|ready/i.test(text)) return 'Cuenta lista para usar';
  return null;
}

/** Translates the terms suppliers use in names and options. */
export function translateTerms(text: string): string {
  return stripDecoration(text)
    .replace(/\[key\]\s*/gi, '')
    .replace(/\(([^()]*\b)?\d+[\s-]*(day|hour|month|year)s?[\s-]*(login )?warranty[^()]*\)/gi, ' ')
    .replace(/\((login|redeem|subscription) warranty only\)|\(subscription warranty\)/gi, ' ')
    .replace(/\(full warranty[^()]*\)|\(no warranty[^()]*\)/gi, ' ')
    .replace(/\(#\d+\)/g, '')
    .replace(/\bready hotmail account\b/gi, 'cuenta lista en Hotmail')
    .replace(/\bready (gmail|admin) account\b/gi, 'cuenta lista $1')
    .replace(/\bmade to order\b/gi, 'bajo pedido')
    .replace(/\bpre-?order\b/gi, 'por encargo')
    .replace(/\bnot a trial\b/gi, 'no es prueba')
    .replace(/\btrial account\b/gi, 'cuenta de prueba')
    .replace(/\bown card needed\b/gi, 'requiere tu tarjeta')
    .replace(/\bno card required\b/gi, 'sin tarjeta')
    .replace(/\bredeem (code|key|link)\b/gi, 'código de canje')
    .replace(/\bcoupon for new accounts\b/gi, 'cupón para cuentas nuevas')
    .replace(/\bnew account\b/gi, 'cuenta nueva')
    .replace(/\bshared account\b/gi, 'cuenta compartida')
    .replace(/\b(official |genuine )?(retail |online |license )*key\b/gi, (m) => (/genuine|official/i.test(m) ? 'clave original' : 'clave'))
    .replace(/\bpermanent\b/gi, 'permanente')
    .replace(/\b1 device\b/gi, '1 dispositivo')
    .replace(/\b(\d+) (members|users|people)\b/gi, '$1 personas')
    .replace(/\bwith\b/gi, 'con')
    .replace(/(\d)(months?|mon|years?|yrs?)\b/gi, '$1 $2')
    .replace(/\(\s*W\d+[DH]\s*\)|\bW\d+[DH]\b/gi, '')
    .replace(/\(?\b(includes\s+)?\d+\s*(d|days?)\s+warranty\)?/gi, '')
    .replace(/\bwarranty\s+\d+\s*d\b/gi, '')
    .replace(/[([]\s*(full warranty|non[ -]?warranty|no warranty|fw|nw)\s*[)\]]/gi, ' ')
    .replace(/\b(full warranty|non[ -]?warranty|no warranty|fw|nw)\b/gi, ' ')
    .replace(/\b(\d+)\s*-\s*(\d+)\s*(days?|d)\b/gi, '$1 a $2 días')
    .replace(/\b(\d+)\s*(months?|mon|m)\b(?!\s*(token|cr))/gi, (_, n) => plural(n, 'mes', 'meses'))
    .replace(/\b(\d+)\s*(years?|yrs?|y)\b/gi, (_, n) => plural(n, 'año', 'años'))
    .replace(/\b(\d+)\s*(days?|d)(?![\wí])/gi, (_, n) => plural(n, 'día', 'días'))
    .replace(/\bfor\b/gi, 'por')
    .replace(/\bwith ads\b/gi, 'con anuncios')
    .replace(/\bon (your )?mail\b/gi, 'en tu correo')
    .replace(/\bon your (acc|account)\b/gi, 'en tu cuenta')
    .replace(/\bon your (number|nu)\b/gi, 'en tu número')
    .replace(/\(\s*(\d+) invites?\s*\)/gi, 'para $1 personas')
    .replace(/\bfamily invite\b/gi, 'por invitación familiar')
    .replace(/\bfull family\b/gi, 'familiar')
    .replace(/\bfamily\b/gi, 'familiar')
    .replace(/\binvitations?\b|\binvites?\b/gi, 'por invitación')
    .replace(/\s[-–—]\s*new users?\b/gi, ' para usuarios nuevos')
    .replace(/\bnew users?\b/gi, 'usuarios nuevos')
    .replace(/\bprem\b/gi, 'Premium')
    .replace(/\bbuisness\b/gi, 'Business')
    .replace(/\b(\d+) profiles?\b/gi, '$1 perfiles')
    .replace(/\bpre[- ]?made\b/gi, 'cuenta lista')
    .replace(/\bready account\b/gi, 'cuenta lista')
    .replace(/\baccount\b/gi, 'cuenta')
    .replace(/\btrial codes\b/gi, 'códigos de prueba')
    .replace(/\bcoupon\b/gi, 'cupón')
    .replace(/\blink\b/gi, 'enlace')
    .replace(/\blifetime( access)?\b/gi, 'de por vida')
    .replace(/\bshared\b/gi, 'compartido')
    .replace(/\bprivate not team\b/gi, 'privado, no de equipo')
    .replace(/\bfull private\b/gi, 'privado')
    .replace(/\bprivate profile\b/gi, 'perfil privado')
    .replace(/\bprivate\b/gi, 'privado')
    .replace(/\bindividual\b/gi, 'individual')
    .replace(/\b(\d+)\s*(people|users?|members)\b/gi, '$1 personas')
    .replace(/\b(\d+)\s*devices\b/gi, '$1 dispositivos')
    .replace(/\b(\d+)x? seats?\b/gi, '$1 puestos')
    .replace(/\b(\d[\d.,]*[kmb]?)\s*(cr|cre|crd|credits?)\b/gi, '$1 créditos')
    .replace(/\bai credits?\b/gi, 'créditos de IA')
    .replace(/\bcredits?\b/gi, 'créditos')
    .replace(/\btokens?\b/gi, 'tokens')
    .replace(/\(\s*\)|\[\s*\]/g, '')
    .replace(/(\w)\(/g, '$1 (')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s[-–—]\s/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[\s,–—-]+$/g, '')
    .trim();
}

// How each brand reads inside a product name, where it differs from its display name.
const NAME_IN_TITLE: Record<string, string> = {
  google: 'Google',
  kling: 'Kling',
  leonardo: 'Leonardo',
  wispr: 'Wispr',
  fin: 'Fin',
  proton: 'Proton',
  hma: 'HMA',
  snapchat: 'Snapchat',
  youtube: 'YouTube',
  adobe: 'Adobe',
  linkedin: 'LinkedIn',
  gamma: 'Gamma',
};

function buildName(rawName: string): string {
  const brand = detectBrand(stripDecoration(rawName));
  let name = translateTerms(rawName);
  const label = NAME_IN_TITLE[brand.id] || brand.name;

  if (brand.id !== 'otros') {
    // Writes the brand the way it's written officially: "Capcut pro" is "CapCut pro".
    name = name.replace(/^(MS|Microsoft)\s+(?=(office|microsoft) ?365)/i, '').replace(brand.match, label);
    // "Zoom - Zoom Pro" and "Quizlet - Plus" lost their dash above: keep the brand once.
    name = name.replace(new RegExp(`^(${label})\\s+\\1\\b`, 'i'), '$1');
  }

  name = name
    .split(' ')
    // Suppliers shout some names: "SUPER DUOLINGO" reads better as a title.
    .map((word) => (/^[A-ZÁÉÍÓÚÑ]{4,}$/.test(word) ? word[0] + word.slice(1).toLowerCase() : word))
    .join(' ')
    .replace(/\bpro\b/gi, 'Pro')
    .replace(/\bplus\b/g, 'Plus')
    .replace(/\bbusiness\b/gi, 'Business')
    .replace(/\bstarter\b/gi, 'Starter')
    .replace(/\blite\b/gi, 'Lite')
    .replace(/\bedu\b/gi, 'Edu')
    .replace(/\bvip\b/gi, 'VIP')
    .replace(/\bAi\b/g, 'AI');

  // Brands such as iLovePDF, edX and n8n start in lowercase on purpose.
  return name.startsWith(label) ? name : name.replace(/^./, (c) => c.toUpperCase());
}

export interface DescribedProduct {
  name: string;
  summary: string;
  brandId: string;
  brandName: string;
  logo: string | null;
  categoryId: string;
  categoryName: string;
  info: ProductInfo;
  searchText: string;
}

export function describeProduct(
  productKey: string,
  rawName: string,
  warrantyDays?: number | null
): DescribedProduct {
  const clean = stripDecoration(rawName);
  const brand = detectBrand(clean);
  const detail = PRODUCT_DETAILS[productKey] || {};
  const name = detail.name || buildName(rawName);

  const duration = detail.duration ?? parseDuration(clean);
  const warranty =
    detail.warranty ?? parseWarranty(clean) ?? (warrantyDays ? plural(String(warrantyDays), 'día', 'días') : null);
  const delivery = detail.delivery ?? parseDelivery(clean);

  // Nothing is claimed beyond what the supplier states: the rest is settled by chat.
  const info: ProductInfo = {
    duration: duration || 'Se confirma por chat',
    warranty: warranty || 'Se confirma por chat',
    delivery: delivery || 'Se confirma por chat',
    includes: detail.includes || [],
    steps: detail.steps || [],
    notes: detail.notes || [],
    hasDetails: Boolean(detail.summary),
  };

  const months = duration?.match(/^(\d+) (mes|año)/);
  const durationAliases = months
    ? months[2] === 'mes'
      ? `${months[1]} months ${months[1]}m`
      : `${months[1]} year ${months[1]}y ${Number(months[1]) * 12} meses ${Number(months[1]) * 12} months`
    : '';

  return {
    name,
    summary: detail.summary || `Producto digital de ${brand.name}.`,
    brandId: brand.id,
    brandName: brand.name,
    logo: brand.logo ? `/brands/${brand.logo}` : null,
    categoryId: brand.categoryId,
    categoryName: getCategoryName(brand.categoryId),
    info,
    searchText: normalizeForSearch(`${name} ${clean} ${brand.name} ${getCategoryName(brand.categoryId)} ${duration || ''} ${durationAliases}`),
  };
}
