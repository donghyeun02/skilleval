import { describe, expect, it } from 'vitest';
import { REPORT_SCHEMA_VERSION } from '../src/grade.js';
import type { SuiteReport } from '../src/grade.js';
import { renderMarkdown } from '../src/report/markdown.js';

const report: SuiteReport = {
  schemaVersion: REPORT_SCHEMA_VERSION,
  skillName: 'find-game-reference',
  generatedAt: '2026-11-02T00:00:00.000Z',
  evalsWithoutAssertions: [2],
  evals: [
    {
      id: 0,
      prompt: '매치3 레퍼런스 찾아줘 | 모바일',
      ungradedExpectations: ['톤이 친절하다'],
      variants: [
        {
          variant: 'with_skill',
          source: 'a',
          passed: 2,
          total: 2,
          assertions: [
            { name: 'table', passed: true, evidence: 'ok' },
            { name: 'source link', passed: true, evidence: 'line 3' },
          ],
        },
        {
          variant: 'without_skill',
          source: 'b',
          passed: 1,
          total: 2,
          assertions: [
            { name: 'table', passed: true, evidence: 'ok' },
            { name: 'source link', passed: false, evidence: 'no match' },
          ],
        },
      ],
    },
  ],
  summary: {
    with_skill: { passed: 2, total: 2, passRate: 1 },
    without_skill: { passed: 1, total: 2, passRate: 0.5 },
  },
};

describe('renderMarkdown', () => {
  const md = renderMarkdown(report);

  it('starts with a summary line per variant', () => {
    expect(md).toContain('| with_skill | 2/2 | 100% |');
    expect(md).toContain('| without_skill | 1/2 | 50% |');
  });

  it('lists failed assertions with evidence', () => {
    expect(md).toContain('❌ source link — no match');
  });

  it('escapes pipes in prompts so tables do not break', () => {
    expect(md).toContain('매치3 레퍼런스 찾아줘 \\| 모바일');
  });

  it('warns about evals without assertions and ungraded expectations', () => {
    expect(md).toContain('eval 2');
    expect(md).toContain('톤이 친절하다');
  });

  it('includes the comparison when given', () => {
    const withCompare = renderMarkdown(report, {
      baseline: 1,
      current: 0.5,
      delta: -0.5,
      newlyFailing: [{ evalId: 0, assertion: 'source link' }],
      newlyPassing: [],
      compared: 2,
      regressed: true,
    });

    expect(withCompare).toContain('REGRESSION');
    expect(withCompare).toContain('100% → 50%');
    expect(withCompare).toContain('newly failing: eval 0 · source link');
  });
});
