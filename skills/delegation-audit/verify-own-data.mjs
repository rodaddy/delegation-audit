import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const VERDICTS = [
  'AI carries it',
  'AI drafts, you approve',
  'Hand down, AI assists',
  'Hand down, no AI',
  'Stays yours',
];

// The controlled vocabularies the grilling sequence produces. A field that is
// present but answered "unknown" is an ungraded task, not a graded one: the
// record is a receipt of the conversation, so the ANSWER has to be one the
// table can route, not merely a non-empty string.
const LOCATIONS = ['on a screen', 'in the world'];
const SEVERITIES = ['small and reversible', 'real and hard to undo'];
const JUDGMENTS = ["nobody's", 'a judgment', 'yours'];

// `- <task> | field: value | field: value ...` -> Map(field -> value).
function fieldsOf(line) {
  const map = new Map();
  for (const segment of line.split('|').slice(1)) {
    const at = segment.indexOf(':');
    if (at === -1) continue;
    map.set(segment.slice(0, at).trim().toLowerCase(), segment.slice(at + 1).trim());
  }
  return map;
}

function checkVocabulary(errors, fields, field, allowed, line) {
  const value = fields.get(field);
  if (value === undefined) return;
  if (!allowed.includes(value)) {
    errors.push(`task record has an unroutable ${field} "${value}": ${line}`);
  }
}

/**
 * @param {string} markdown  the audit's tasks.md
 * @param {{requireRefusal?: boolean}} [options]
 *   `requireRefusal: true` is the INSTALL-verification mode (KIT-STANDARD
 *   §4.10): the buyer's own week must have produced a real refusal, and a
 *   declared-empty queue does not satisfy it. Default `false` is the mode the
 *   worked examples are checked in, where an honestly empty queue is a legal
 *   outcome and manufacturing a refusal to pass would be the defect.
 */
export function verifyOwnDataRecord(markdown, options = {}) {
  const requireRefusal = options.requireRefusal === true;
  const errors = [];
  const weekMatch = /^Total hours worked per week:\s*(\d+(?:\.\d+)?)(?:\s|$)/mi.exec(markdown);
  if (!weekMatch || Number(weekMatch[1]) <= 0) errors.push('missing real-week number');

  const rateMatch = /^Effective hourly rate:\s*(not set|\$?\d+(?:\.\d+)?)(?:\s|$)/mi.exec(markdown);
  if (!rateMatch) errors.push('missing rate-gate result');

  if (!/^Execution tier:\s*T[123]\b/mi.test(markdown)) errors.push('missing execution tier');

  const taskLines = markdown.split('\n').filter((line) => /^- .+\|/.test(line));
  if (taskLines.length === 0) errors.push('no graded task records found');
  for (const line of taskLines) {
    for (const field of [
      'hours per week:',
      'screen or world:',
      'what breaks if wrong:',
      'how bad:',
      'whose judgment:',
      'outcome owner:',
      'verdict:',
    ]) {
      if (!line.includes(field)) errors.push(`task record missing ${field} ${line}`);
    }
    if (!VERDICTS.some((verdict) => line.includes(`verdict: ${verdict}`))) {
      errors.push(`task record has no table verdict: ${line}`);
    }

    const fields = fieldsOf(line);
    checkVocabulary(errors, fields, 'screen or world', LOCATIONS, line);
    checkVocabulary(errors, fields, 'how bad', SEVERITIES, line);
    checkVocabulary(errors, fields, 'whose judgment', JUDGMENTS, line);

    const hours = fields.get('hours per week');
    if (hours !== undefined && !/^\d+(?:\.\d+)?$/.test(hours)) {
      errors.push(`task record has a non-numeric hours per week "${hours}": ${line}`);
    }

    // The one named owner is only required where the table routes on it. Where
    // the task needs "a judgment" the owner is a NAME; anywhere else it is the
    // literal "not applicable". "unknown" is never a graded answer.
    const owner = fields.get('outcome owner');
    const judgment = fields.get('whose judgment');
    if (owner !== undefined) {
      if (judgment === 'a judgment') {
        if (owner === '' || owner === 'not applicable' || /^unknown$/i.test(owner)) {
          errors.push(`task record needing a judgment has no named outcome owner: ${line}`);
        }
      } else if (owner !== 'not applicable') {
        errors.push(`task record has an outcome owner "${owner}" but needs no judgment: ${line}`);
      }
    }
  }

  // The refusal receipt. A run whose queue is genuinely empty says so in those
  // words rather than manufacturing a refusal it never made -- that declaration
  // is itself the deterministic answer, and it is what the examples use.
  const refusalShown = /REFUSED:/i.test(markdown) && /Unblocking question:/i.test(markdown);
  const queueDeclaredEmpty = /^Queue is empty:/mi.test(markdown);
  if (!refusalShown && !(queueDeclaredEmpty && !requireRefusal)) {
    errors.push('missing demonstrated refusal with one unblocking question');
  }
  return errors;
}

export async function verifyRecordFiles(paths, options = {}) {
  let failures = 0;
  for (const path of paths) {
    const errors = verifyOwnDataRecord(await readFile(path, 'utf8'), options);
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
  const args = process.argv.slice(2);
  const requireRefusal = args.includes('--install');
  const paths = args.filter((arg) => !arg.startsWith('--'));
  if (paths.length === 0) {
    console.error('Usage: node verify-own-data.mjs [--install] <tasks.md> [more.md ...]');
    console.error('  --install  install verification: a real refusal is required');
    process.exitCode = 3;
  } else {
    try {
      process.exitCode = (await verifyRecordFiles(paths, { requireRefusal })) === 0 ? 0 : 1;
    } catch (error) {
      // An unreadable path is an invocation error (exit 3), not a content failure.
      console.error(`ERROR ${error.message}`);
      process.exitCode = 3;
    }
  }
}
