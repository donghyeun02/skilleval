import { describe, expect, it } from 'vitest';
import { evaluateSuite } from '../src/grade.js';
import type { Runner, Variant } from '../src/runners/types.js';
import type { EvalCase, EvalSuite } from '../src/schema/evals.js';

function fakeRunner(outputs: Readonly<Record<string, string>>): Runner {
  return {
    run: (evalCase: EvalCase, variant: Variant) =>
      Promise.resolve({ text: outputs[`${String(evalCase.id)}:${variant}`] ?? '', source: `fake:${variant}` }),
  };
}

const suite: EvalSuite = {
  skillName: 'demo',
  evals: [
    {
      id: 0,
      prompt: 'p0',
      expectedOutput: 'e0',
      files: [],
      expectations: ['reads nicely'],
      assertions: [
        { type: 'contains', value: 'A', ignoreCase: false },
        { type: 'contains', value: 'B', ignoreCase: false },
      ],
    },
    { id: 1, prompt: 'p1', expectedOutput: 'e1', files: [], expectations: [], assertions: [] },
  ],
};

describe('evaluateSuite', () => {
  const runner = fakeRunner({ '0:with_skill': 'A B', '0:without_skill': 'A' });
  const now = new Date('2026-11-02T00:00:00Z');

  it('grades every eval for both variants and summarises pass rates', async () => {
    const report = await evaluateSuite(suite, runner, { now });

    expect(report.summary.with_skill).toEqual({ passed: 2, total: 2, passRate: 1 });
    expect(report.summary.without_skill).toEqual({ passed: 1, total: 2, passRate: 0.5 });
    expect(report.generatedAt).toBe('2026-11-02T00:00:00.000Z');
    expect(report.schemaVersion).toBe(1);
  });

  it('keeps natural-language expectations as ungraded instead of guessing', async () => {
    const report = await evaluateSuite(suite, runner, { now });

    expect(report.evals[0]?.ungradedExpectations).toEqual(['reads nicely']);
  });

  it('marks evals without assertions so they do not silently count as passing', async () => {
    const report = await evaluateSuite(suite, runner, { now });

    expect(report.evals[1]?.variants.every((v) => v.total === 0)).toBe(true);
    expect(report.evalsWithoutAssertions).toEqual([1]);
  });

  it('can run a single variant', async () => {
    const report = await evaluateSuite(suite, runner, { now, variants: ['with_skill'] });

    expect(report.evals[0]?.variants.map((v) => v.variant)).toEqual(['with_skill']);
    expect(report.summary.without_skill).toBeUndefined();
  });

  it('returns pass rate 0 rather than NaN when nothing is graded', async () => {
    const empty: EvalSuite = { skillName: 'x', evals: [] };

    const report = await evaluateSuite(empty, runner, { now });

    expect(report.summary.with_skill).toEqual({ passed: 0, total: 0, passRate: 0 });
  });
});
