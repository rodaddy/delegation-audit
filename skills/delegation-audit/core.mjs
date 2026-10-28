const VERDICTS = Object.freeze({
  AI_CARRIES: "AI carries it",
  AI_DRAFTS: "AI drafts, you approve",
  HAND_DOWN_AI: "Hand down, AI assists",
  HAND_DOWN_NO_AI: "Hand down, no AI",
  STAYS_YOURS: "Stays yours",
});

const FREQUENCY_DIVISORS = Object.freeze({
  week: 1,
  month: 4.33,
  quarter: 13,
  year: 48,
});

export { VERDICTS };

export function compareVersions(installed, incoming) {
  const parse = (value) => {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(value).trim());
    if (!match) throw new TypeError(`Invalid semantic version: ${value}`);
    return match.slice(1).map(Number);
  };
  const left = parse(installed);
  const right = parse(incoming);
  for (let index = 0; index < 3; index += 1) {
    if (left[index] < right[index]) return -1;
    if (left[index] > right[index]) return 1;
  }
  return 0;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function routeVerdict({ location, judgment, consequence, owner }) {
  if (!['on a screen', 'in the world'].includes(location)) {
    throw new TypeError(`Unsupported task location: ${location}`);
  }
  if (!['nobody\'s', 'a judgment', 'yours'].includes(judgment)) {
    throw new TypeError(`Unsupported judgment: ${judgment}`);
  }
  if (!['small and reversible', 'real and hard to undo'].includes(consequence)) {
    throw new TypeError(`Unsupported consequence: ${consequence}`);
  }

  if (judgment === 'yours') return VERDICTS.STAYS_YOURS;
  if (location === 'in the world') return VERDICTS.HAND_DOWN_NO_AI;
  if (judgment === 'a judgment') {
    return {
      verdict: VERDICTS.HAND_DOWN_AI,
      owner: owner?.trim() || 'no single owner',
    };
  }
  return consequence === 'small and reversible'
    ? VERDICTS.AI_CARRIES
    : VERDICTS.AI_DRAFTS;
}

export function toWeeklyHours({ hours, frequency, occurrences = 1 }) {
  if (!Number.isFinite(hours) || hours < 0) {
    throw new TypeError('hours must be a non-negative finite number');
  }
  if (!Number.isFinite(occurrences) || occurrences <= 0) {
    throw new TypeError('occurrences must be a positive finite number');
  }
  const divisor = FREQUENCY_DIVISORS[frequency];
  if (!divisor) throw new TypeError(`Unsupported frequency: ${frequency}`);
  return (hours * occurrences) / divisor;
}

export function computeAudit(tasks, effectiveHourlyRate = null) {
  const totals = {
    totalHoursReviewed: 0,
    aiCarriesHours: 0,
    aiDraftsHours: 0,
    handDownHours: 0,
  };

  for (const task of tasks) {
    const hours = Number(task.hoursPerWeek);
    if (!Number.isFinite(hours) || hours < 0) {
      throw new TypeError('Each graded task needs non-negative finite hoursPerWeek');
    }
    totals.totalHoursReviewed += hours;
    switch (task.verdict) {
      case VERDICTS.AI_CARRIES:
        totals.aiCarriesHours += hours;
        break;
      case VERDICTS.AI_DRAFTS:
        totals.aiDraftsHours += hours;
        break;
      case VERDICTS.HAND_DOWN_AI:
      case VERDICTS.HAND_DOWN_NO_AI:
        totals.handDownHours += hours;
        break;
      case VERDICTS.STAYS_YOURS:
        break;
      default:
        throw new TypeError(`Unsupported verdict: ${task.verdict}`);
    }
  }

  const hoursAiCarries = totals.aiCarriesHours + totals.aiDraftsHours;
  const hoursPersonCarries = totals.handDownHours / 2;
  const reclaimedHoursPerWeek = hoursAiCarries + hoursPersonCarries;
  const reclaimedHoursPerMonth = Math.round(reclaimedHoursPerWeek * 4.33 * 10) / 10;
  const rateIsSet = Number.isFinite(effectiveHourlyRate) && effectiveHourlyRate >= 0;

  return {
    ...totals,
    hoursAiCarries,
    hoursPersonCarries,
    reclaimedHoursPerWeek,
    reclaimedHoursPerMonth,
    monthlyValue: rateIsSet ? Math.round(reclaimedHoursPerMonth * effectiveHourlyRate) : null,
  };
}
