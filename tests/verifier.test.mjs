import test from 'node:test';
import assert from 'node:assert/strict';

import { verifyHtml } from '../skills/delegation-audit/verify-html.mjs';
import { verifyOwnDataRecord } from '../skills/delegation-audit/verify-own-data.mjs';

function page(overrides = '') {
  return `<!doctype html>
<meta name="delegation-audit-tier" content="T1">
<meta name="delegation-audit-rate" content="set">
<div class="headline" data-reclaimed-hours="4" data-ai-hours="3" data-person-hours="1"></div>
<p data-execution-tier="T1">Execution tier: T1</p>${overrides}`;
}

test('HTML verifier accepts a safe complete page contract', () => {
  assert.deepEqual(verifyHtml(page()), []);
});

test('HTML verifier rejects placeholders and active content', () => {
  const errors = verifyHtml(page('{{NAME}}<script>alert(1)</script><img src=x onerror="x()"><a href="javascript:x()">x</a>'));
  assert.ok(errors.includes('unresolved placeholder remains'));
  assert.ok(errors.includes('script elements are not allowed'));
  assert.ok(errors.includes('inline event handlers are not allowed'));
  assert.ok(errors.includes('javascript URLs are not allowed'));
});

test('HTML verifier rejects external resources', () => {
  assert.ok(verifyHtml(page('<img src="https://example.com/logo.png">')).includes('external resources are not allowed'));
});

test('HTML verifier enforces rate omission', () => {
  const html = page('$100').replace('content="set"', 'content="not-set"');
  assert.ok(verifyHtml(html).some((error) => error.startsWith('rate gate breach')));
});

test('HTML verifier requires tier label and T3 advisory', () => {
  const html = page().replaceAll('T1', 'T3').replace('<p data-execution-tier="T3">Execution tier: T3</p>', '');
  const errors = verifyHtml(html);
  assert.ok(errors.includes('missing visible execution-tier label'));
  assert.ok(errors.includes('T3 page is missing the advisory notice'));
});

test('HTML verifier rejects split-total inconsistencies', () => {
  assert.ok(verifyHtml(page().replace('data-person-hours="1"', 'data-person-hours="2"')).some((error) => error.startsWith('split-total mismatch')));
});

test('own-data verifier requires literal grilling receipt fields', () => {
  const record = `
Total hours worked per week: 52
Effective hourly rate: not set
Execution tier: T2
- Send renewal notices | hours per week: 2 | screen or world: on a screen | what breaks if wrong: deadline passes | how bad: real and hard to undo | whose judgment: a judgment | outcome owner: Pat | verdict: Hand down, AI assists
## Un-finished queue
- "vendor stuff" -- REFUSED: no concrete action. Unblocking question: which vendor action took the most time?
`;
  assert.deepEqual(verifyOwnDataRecord(record), []);
});

test('own-data verifier rejects nonnumeric week and rate claims', () => {
  const record = `
Total hours worked per week: plenty
Effective hourly rate: expensive
Execution tier: T2
- Send renewal notices | hours per week: 2 | screen or world: on a screen | what breaks if wrong: deadline passes | how bad: real and hard to undo | whose judgment: a judgment | outcome owner: Pat | verdict: Hand down, AI assists
## Un-finished queue
- "vendor stuff" -- REFUSED: no concrete action. Unblocking question: which vendor action took the most time?
`;
  const errors = verifyOwnDataRecord(record);
  assert.ok(errors.includes('missing real-week number'));
  assert.ok(errors.includes('missing rate-gate result'));
});

test('HTML verifier catches external resources spelled around the quote gate', () => {
  // Each of these passed the pre-hardening regex, and every one of them is a
  // page that phones home to a third party on open.
  for (const attack of [
    '<img src=https://evil.example/x.png>',
    '<img srcset="https://evil.example/x.png 1x">',
    "<img SRC = '//evil.example/x.png'>",
    '<video poster="https://evil.example/p.jpg"></video>',
    '<a href="https&#58;//evil.example/">x</a>',
  ]) {
    assert.ok(
      verifyHtml(page(attack)).includes('external resources are not allowed'),
      `not caught: ${attack}`,
    );
  }
});

test('HTML verifier catches entity-obfuscated javascript URLs', () => {
  for (const attack of [
    '<a href="java&#x73;cript:alert(1)">x</a>',
    '<a href="java&#115;cript:alert(1)">x</a>',
    '<a href=javascript:alert(1)>x</a>',
  ]) {
    assert.ok(
      verifyHtml(page(attack)).includes('javascript URLs are not allowed'),
      `not caught: ${attack}`,
    );
  }
});

test('HTML verifier catches money spelled without a dollar sign', () => {
  const notSet = (body) => page(body).replace('content="set"', 'content="not-set"');
  for (const body of [
    '<p>47.6 hours are worth 2,523 dollars a month</p>',
    '<p>That is 2523 USD a month</p>',
    '<p>Worth &dollar;2,523 a month</p>',
    '<p>Billed at 53 per hour</p>',
  ]) {
    assert.ok(
      verifyHtml(notSet(body)).some((error) => error.startsWith('rate gate breach')),
      `not caught: ${body}`,
    );
  }
});

test('HTML verifier does not false-fail an honest hours-only page', () => {
  const notSet = page('<p>You could reclaim 47.6 hours a month. No rate was given, so no money is shown.</p>')
    .replace('content="set"', 'content="not-set"');
  assert.deepEqual(verifyHtml(notSet), []);
});

test('HTML verifier reads split totals off the headline, not off a decoy', () => {
  // The decoy sits BEFORE the headline, so a check that takes the first match
  // anywhere in the document reads consistent numbers while the headline the
  // buyer actually sees is inconsistent.
  const decoyed = page().replace(
    '<div class="headline"',
    '<span hidden data-reclaimed-hours="4" data-ai-hours="3" data-person-hours="1"></span>\n<div class="headline"',
  ).replace('data-person-hours="1"></div>', 'data-person-hours="9"></div>');
  assert.ok(verifyHtml(decoyed).some((error) => error.startsWith('split-total mismatch')));
});

test('own-data verifier rejects present-but-unroutable field answers', () => {
  const record = `
Total hours worked per week: 52
Effective hourly rate: not set
Execution tier: T2
- Send renewal notices | hours per week: 2 | screen or world: unknown | what breaks if wrong: deadline passes | how bad: unknown | whose judgment: a judgment | outcome owner: unknown | verdict: Hand down, AI assists
## Un-finished queue
- "vendor stuff" -- REFUSED: no concrete action. Unblocking question: which vendor action took the most time?
`;
  const errors = verifyOwnDataRecord(record);
  assert.ok(errors.some((error) => error.includes('unroutable screen or world')));
  assert.ok(errors.some((error) => error.includes('unroutable how bad')));
  assert.ok(errors.some((error) => error.includes('no named outcome owner')));
});

test('own-data verifier requires "not applicable" where no judgment is needed', () => {
  const record = `
Total hours worked per week: 52
Effective hourly rate: not set
Execution tier: T2
- Send renewal notices | hours per week: 2 | screen or world: on a screen | what breaks if wrong: deadline passes | how bad: small and reversible | whose judgment: nobody's | outcome owner: Pat | verdict: AI carries it
## Un-finished queue
- "vendor stuff" -- REFUSED: no concrete action. Unblocking question: which vendor action took the most time?
`;
  assert.ok(verifyOwnDataRecord(record).some((error) => error.includes('needs no judgment')));
});

test('own-data verifier accepts a declared-empty queue but not for install verification', () => {
  const record = `
Total hours worked per week: 52
Effective hourly rate: not set
Execution tier: T2
- Send renewal notices | hours per week: 2 | screen or world: on a screen | what breaks if wrong: deadline passes | how bad: small and reversible | whose judgment: nobody's | outcome owner: not applicable | verdict: AI carries it
## Un-finished queue
Queue is empty: every task was described concretely enough to grade.
`;
  assert.deepEqual(verifyOwnDataRecord(record), []);
  assert.ok(
    verifyOwnDataRecord(record, { requireRefusal: true })
      .includes('missing demonstrated refusal with one unblocking question'),
  );
});
