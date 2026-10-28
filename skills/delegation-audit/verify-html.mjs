import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const TIER_NOTICE = 'T3 advisory: script-enforced gates are advisory in this chat-only run.';

function metaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const forward = new RegExp(`<meta\\s+[^>]*name=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  const reverse = new RegExp(`<meta\\s+[^>]*content=["']([^"']+)["'][^>]*name=["']${escaped}["'][^>]*>`, 'i');
  return forward.exec(html)?.[1] ?? reverse.exec(html)?.[1] ?? null;
}

// Read a numeric data-* attribute from ONE element rather than from anywhere in
// the document. A decoy `data-ai-hours` in a comment or a hidden node must not
// be what the split-total arithmetic is checked against.
function numericAttributeOn(elementHtml, name) {
  if (elementHtml === null) return null;
  const match = new RegExp(`\\b${name}=["'](-?\\d+(?:\\.\\d+)?)["']`, 'i').exec(elementHtml);
  return match ? Number(match[1]) : null;
}

// The opening tag of the first element carrying class="... headline ...".
function headlineTag(html) {
  const tags = html.match(/<[a-z][^>]*>/gi) ?? [];
  for (const tag of tags) {
    const classMatch = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
    const value = classMatch?.[1] ?? classMatch?.[2] ?? classMatch?.[3] ?? '';
    if (value.split(/\s+/).includes('headline')) return tag;
  }
  return null;
}

// Browsers decode HTML entities and percent-escapes before they resolve a URL;
// a regex over the raw source does not. Decode first, then gate -- otherwise
// href="java&#x73;cript:..." and an entity-escaped https:// walk straight past.
function decodeEntities(html) {
  return html
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&colon;?/gi, ':')
    .replace(/&sol;?/gi, '/')
    .replace(/&lpar;?/gi, '(')
    .replace(/&dollar;?/gi, '$')
    .replace(/&period;?/gi, '.')
    .replace(/&Tab;?|&NewLine;?/gi, '')
    .replace(/&amp;?/gi, '&');
}

export function verifyHtml(html) {
  // Every content gate runs against the DECODED source, so an obfuscated URL is
  // judged the way a browser would resolve it, not the way it is spelled. The
  // metadata and tier-label reads stay on the RAW source, because those are
  // exact literal contracts the kit itself writes.
  const decoded = decodeEntities(html);
  const errors = [];
  // An attribute value may be double-quoted, single-quoted, or bare.
  const VALUE = String.raw`(?:"[\s]*|'[\s]*|[\s]*)`;
  const checks = [
    [/\{\{[^}]+\}\}/, 'unresolved placeholder remains'],
    [/<script\b/i, 'script elements are not allowed'],
    [/\son[a-z]+\s*=/i, 'inline event handlers are not allowed'],
    [
      new RegExp(String.raw`(?:href|src|srcset|action|formaction|data|poster|xlink:href)\s*=\s*${VALUE}(?:java|vb)script\s*:`, 'i'),
      'javascript URLs are not allowed',
    ],
    [/<(?:iframe|object|embed|form)\b/i, 'active embedded content is not allowed'],
    [/<meta\b[^>]*http-equiv\s*=\s*["']?refresh/i, 'meta refresh is not allowed'],
    [
      new RegExp(String.raw`(?:href|src|srcset|imagesrcset|poster|data|action|formaction|xlink:href)\s*=\s*${VALUE}(?:[a-z][a-z0-9+.-]*:)?\/\/`, 'i'),
      'external resources are not allowed',
    ],
    [/@import\s+(?:url\()?\s*["']?(?:[a-z][a-z0-9+.-]*:)?\/\//i, 'external CSS imports are not allowed'],
    [/url\(\s*["']?(?:[a-z][a-z0-9+.-]*:)?\/\//i, 'external CSS resources are not allowed'],
  ];
  for (const [pattern, message] of checks) {
    if (pattern.test(decoded)) errors.push(message);
  }

  const tier = metaContent(html, 'delegation-audit-tier');
  if (!['T1', 'T2', 'T3'].includes(tier)) {
    errors.push('missing or invalid delegation-audit-tier metadata');
  }
  if (!new RegExp(`data-execution-tier=["']${tier ?? ''}["']`, 'i').test(html)) {
    errors.push('missing visible execution-tier label');
  }
  if (tier === 'T3' && !html.includes(TIER_NOTICE)) {
    errors.push('T3 page is missing the advisory notice');
  }

  const rate = metaContent(html, 'delegation-audit-rate');
  if (!['set', 'not-set'].includes(rate)) {
    errors.push('missing or invalid delegation-audit-rate metadata');
  }
  if (rate === 'not-set') {
    // Money is money however it is spelled. Only the VISIBLE text is searched,
    // so a favicon data URI or a CSS rule containing a currency character
    // cannot false-fail an honest hours-only page -- the earlier version
    // grepped the whole file for a literal '$' and did exactly that.
    const visible = decoded
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ');
    const moneyPatterns = [
      [/[$£€¥₹]\s*\d/, 'a currency symbol next to a number'],
      [/\b\d[\d,]*(?:\.\d+)?\s*(?:dollars?|euros?|pounds?|usd|eur|gbp)\b/i, 'a spelled-out currency amount'],
      [/\b(?:usd|eur|gbp)\s*\d/i, 'a currency code next to a number'],
      [/\b\d[\d,]*(?:\.\d+)?\s*(?:an?\s+hour|per\s+hour|\/\s*hr\b|\/\s*hour\b)/i, 'an hourly rate'],
    ];
    for (const [pattern, what] of moneyPatterns) {
      if (pattern.test(visible)) {
        errors.push(`rate gate breach: ${what} appears when rate is not set`);
      }
    }
  }

  // Read the split totals off the headline element itself. Reading the first
  // match anywhere in the document let a decoy attribute elsewhere satisfy the
  // arithmetic while the displayed headline stayed inconsistent.
  const headline = headlineTag(html);
  if (headline === null) {
    errors.push('missing headline element carrying the split totals');
  }
  const reclaimed = numericAttributeOn(headline, 'data-reclaimed-hours');
  const ai = numericAttributeOn(headline, 'data-ai-hours');
  const person = numericAttributeOn(headline, 'data-person-hours');
  if ([reclaimed, ai, person].some((value) => value === null)) {
    if (headline !== null) errors.push('missing split-total data attributes');
  } else if (Math.abs(ai + person - reclaimed) > 0.005) {
    errors.push(`split-total mismatch: ${ai} + ${person} != ${reclaimed}`);
  }

  return errors;
}

export async function verifyFiles(paths) {
  let failures = 0;
  for (const path of paths) {
    const errors = verifyHtml(await readFile(path, 'utf8'));
    if (errors.length === 0) {
      console.log(`PASS ${path}`);
      continue;
    }
    failures += 1;
    console.error(`FAIL ${path}`);
    for (const error of errors) console.error(`  - ${error}`);
  }
  return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const paths = process.argv.slice(2);
  if (paths.length === 0) {
    console.error('Usage: node verify-html.mjs <audit.html> [more.html ...]');
    process.exitCode = 3;
  } else {
    try {
      process.exitCode = (await verifyFiles(paths)) === 0 ? 0 : 1;
    } catch (error) {
      // An unreadable path is an invocation error (exit 3), not a content failure.
      console.error(`ERROR ${error.message}`);
      process.exitCode = 3;
    }
  }
}
