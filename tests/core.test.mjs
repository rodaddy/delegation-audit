import test from 'node:test';
import assert from 'node:assert/strict';

import {
  VERDICTS,
  compareVersions,
  computeAudit,
  escapeHtml,
  routeVerdict,
  toWeeklyHours,
} from '../skills/delegation-audit/core.mjs';

test('compareVersions distinguishes upgrade, equal, and downgrade', () => {
  assert.equal(compareVersions('0.2.0', '0.2.1'), -1);
  assert.equal(compareVersions('0.2.1', '0.2.1'), 0);
  assert.equal(compareVersions('0.3.0', '0.2.1'), 1);
  assert.throws(() => compareVersions('unknown', '0.2.1'), /Invalid semantic version/);
});

test('escapeHtml escapes every HTML-significant character', () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')"> & hello`),
    '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt; &amp; hello',
  );
});

test('routeVerdict follows the screen/world table', () => {
  assert.equal(routeVerdict({ location: 'on a screen', judgment: "nobody's", consequence: 'small and reversible' }), VERDICTS.AI_CARRIES);
  assert.equal(routeVerdict({ location: 'on a screen', judgment: "nobody's", consequence: 'real and hard to undo' }), VERDICTS.AI_DRAFTS);
  assert.deepEqual(
    routeVerdict({ location: 'on a screen', judgment: 'a judgment', consequence: 'small and reversible', owner: 'Angela' }),
    { verdict: VERDICTS.HAND_DOWN_AI, owner: 'Angela' },
  );
  assert.equal(routeVerdict({ location: 'in the world', judgment: 'a judgment', consequence: 'real and hard to undo', owner: 'Angela' }), VERDICTS.HAND_DOWN_NO_AI);
  assert.equal(routeVerdict({ location: 'in the world', judgment: 'yours', consequence: 'small and reversible' }), VERDICTS.STAYS_YOURS);
});

test('toWeeklyHours converts supported frequencies', () => {
  assert.equal(toWeeklyHours({ hours: 3, frequency: 'week', occurrences: 2 }), 6);
  assert.ok(Math.abs(toWeeklyHours({ hours: 8, frequency: 'month' }) - (8 / 4.33)) < 1e-12);
  assert.equal(toWeeklyHours({ hours: 6, frequency: 'quarter' }), 6 / 13);
  assert.equal(toWeeklyHours({ hours: 48, frequency: 'year' }), 1);
});

test('computeAudit applies half-credit and omits money without a rate', () => {
  const result = computeAudit([
    { hoursPerWeek: 2, verdict: VERDICTS.AI_CARRIES },
    { hoursPerWeek: 3, verdict: VERDICTS.AI_DRAFTS },
    { hoursPerWeek: 4, verdict: VERDICTS.HAND_DOWN_NO_AI },
    { hoursPerWeek: 1, verdict: VERDICTS.STAYS_YOURS },
  ]);
  assert.equal(result.reclaimedHoursPerWeek, 7);
  assert.equal(result.hoursAiCarries, 5);
  assert.equal(result.hoursPersonCarries, 2);
  assert.equal(result.monthlyValue, null);
});

test('computeAudit applies the published monthly rounding before pricing', () => {
  const result = computeAudit([{ hoursPerWeek: 9.25, verdict: VERDICTS.AI_CARRIES }], 53);
  assert.equal(result.reclaimedHoursPerMonth, 40.1);
  assert.equal(result.monthlyValue, 2125);
});
