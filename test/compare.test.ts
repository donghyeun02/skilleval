import { describe, expect, it } from 'vitest';
import { BaselineError, compareToBaseline } from '../src/compare.js';
import { InputError } from '../src/errors.js';
import { REPORT_SCHEMA_VERSION } from '../src/grade.js';
import type { SuiteReport } from '../src/grade.js';

/** Builds a report from `{ evalId: { assertionName: passed } }` for with_skill. */
function report(results: Readonly<Record<number, Readonly<Record<string, boolean>>>>, skillName = 'demo'): SuiteReport {
  const evals = Object.entries(results).map(([id, assertions]) => {
    const list = Object.entries(assertions).map(([name, passed]) => ({ name, passed, evidence: '' }));
    const passed = list.filter((a) => a.passed).length;
    return {
      id: Number(id),
      prompt: 'p',
      ungradedExpectations: [],
      variants: [{ variant: 'with_skill' as const, source: 's', assertions: list, passed, total: list.length }],
    };
  });
  const passed = evals.reduce((n, e) => n + (e.variants[0]?.passed ?? 0), 0);
  const total = evals.reduce((n, e) => n + (e.variants[0]?.total ?? 0), 0);
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    skillName,
    generatedAt: '2026-11-02T00:00:00.000Z',
    evals,
    evalsWithoutAssertions: [],
    summary: { with_skill: { passed, total, passRate: total === 0 ? 0 : passed / total } },
  };
}

const roundTrip = (r: SuiteReport): unknown => JSON.parse(JSON.stringify(r));

describe('compareToBaseline', () => {
  it('catches a regression in one eval even when another eval improves by the same amount', () => {
    const baseline = report({ 0: { a: true }, 1: { b: false } });
    const current = report({ 0: { a: false }, 1: { b: true } });

    const result = compareToBaseline(current, roundTrip(baseline), { tolerance: 0 });

    expect(result.delta).toBe(0);
    expect(result.regressed).toBe(true);
    expect(result.newlyFailing).toEqual([{ evalId: 0, assertion: 'a' }]);
    expect(result.newlyPassing).toEqual([{ evalId: 1, assertion: 'b' }]);
  });

  it('allows a share of flips within tolerance (LLM outputs vary run to run)', () => {
    const passing = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`a${String(i)}`, true]));
    const oneFlipped = { ...passing, a0: false };

    const within = compareToBaseline(report({ 0: oneFlipped }), roundTrip(report({ 0: passing })), { tolerance: 0.1 });
    const strict = compareToBaseline(report({ 0: oneFlipped }), roundTrip(report({ 0: passing })), { tolerance: 0 });

    expect(within.regressed).toBe(false);
    expect(strict.regressed).toBe(true);
  });

  it('ignores assertions that exist on only one side', () => {
    const result = compareToBaseline(report({ 0: { a: true, added: false } }), roundTrip(report({ 0: { a: true, removed: true } })), {
      tolerance: 0,
    });

    expect(result.compared).toBe(1);
    expect(result.regressed).toBe(false);
  });

  it.each([
    ['not an object', [], /not a JSON object/],
    ['an older schema', { ...report({ 0: { a: true } }), schemaVersion: 0 }, /schemaVersion/],
    ['no summary', { schemaVersion: REPORT_SCHEMA_VERSION, skillName: 'demo', evals: [] }, /passRate/],
    ['zero graded assertions', roundTrip(report({ 0: {} })), /no graded/],
    ['a different skill', roundTrip(report({ 0: { a: true } }, 'other')), /skill "other"/],
    ['nothing in common', roundTrip(report({ 0: { z: true } })), /no assertions in common/],
    [
      'a malformed assertion',
      { ...report({ 0: { a: true } }), evals: [{ id: 0, variants: [{ variant: 'with_skill', assertions: [{}] }] }] },
      /malformed assertion/,
    ],
  ])('rejects a baseline with %s as an input error', (_label, baseline, message) => {
    const run = (): unknown => compareToBaseline(report({ 0: { a: true } }), baseline, { tolerance: 0 });

    expect(run).toThrow(BaselineError);
    expect(run).toThrow(message);
  });

  it('refuses to compare when the current run graded nothing, instead of reporting 0%', () => {
    expect(() => compareToBaseline(report({ 0: {} }), roundTrip(report({ 0: { a: true } })), { tolerance: 0 })).toThrow(
      /no graded with_skill/,
    );
  });

  it('rejects tolerance outside 0..1 as an input error', () => {
    const r = report({ 0: { a: true } });

    expect(() => compareToBaseline(r, roundTrip(r), { tolerance: 2 })).toThrow(InputError);
  });
});
