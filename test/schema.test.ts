import { describe, expect, it } from 'vitest';
import { EvalSchemaError, parseEvalSuite } from '../src/schema/evals.js';

const minimalSuite = {
  skill_name: 'demo',
  evals: [{ id: 0, prompt: 'p', expected_output: 'e' }],
};

describe('parseEvalSuite', () => {
  it('accepts the skill-creator format and fills optional fields with empty arrays', () => {
    const suite = parseEvalSuite(minimalSuite);

    expect(suite).toEqual({
      skillName: 'demo',
      evals: [
        { id: 0, prompt: 'p', expectedOutput: 'e', files: [], expectations: [], assertions: [] },
      ],
    });
  });

  it('keeps natural-language expectations so they can be reported as ungraded', () => {
    const suite = parseEvalSuite({
      skill_name: 'demo',
      evals: [{ id: 1, prompt: 'p', expected_output: 'e', expectations: ['mentions X'] }],
    });

    expect(suite.evals[0]?.expectations).toEqual(['mentions X']);
  });

  it('parses every assertion type', () => {
    const assertions = [
      { type: 'contains', value: 'a', ignore_case: true, name: 'has a' },
      { type: 'not-contains', value: 'b' },
      { type: 'regex', pattern: '^#', flags: 'm' },
      { type: 'heading', pattern: '차별화' },
      { type: 'min-table-rows', count: 3 },
      { type: 'min-chars', count: 10 },
      { type: 'max-chars', count: 100 },
    ];

    const suite = parseEvalSuite({
      skill_name: 'demo',
      evals: [{ id: 0, prompt: 'p', expected_output: 'e', assertions }],
    });

    expect(suite.evals[0]?.assertions).toEqual([
      { type: 'contains', value: 'a', ignoreCase: true, name: 'has a' },
      { type: 'not-contains', value: 'b', ignoreCase: false },
      { type: 'regex', pattern: '^#', flags: 'm' },
      { type: 'heading', pattern: '차별화' },
      { type: 'min-table-rows', count: 3 },
      { type: 'min-chars', count: 10 },
      { type: 'max-chars', count: 100 },
    ]);
  });

  it.each([
    ['root is not an object', [], '$'],
    ['skill_name missing', { evals: [] }, '$.skill_name'],
    ['evals not an array', { skill_name: 'x', evals: {} }, '$.evals'],
    ['eval id not an integer', { skill_name: 'x', evals: [{ id: 1.5, prompt: 'p', expected_output: 'e' }] }, '$.evals[0].id'],
    ['prompt empty', { skill_name: 'x', evals: [{ id: 0, prompt: '', expected_output: 'e' }] }, '$.evals[0].prompt'],
    [
      'unknown assertion type',
      { skill_name: 'x', evals: [{ id: 0, prompt: 'p', expected_output: 'e', assertions: [{ type: 'nope' }] }] },
      '$.evals[0].assertions[0].type',
    ],
    [
      'invalid regex',
      { skill_name: 'x', evals: [{ id: 0, prompt: 'p', expected_output: 'e', assertions: [{ type: 'regex', pattern: '(' }] }] },
      '$.evals[0].assertions[0].pattern',
    ],
    [
      'negative count',
      { skill_name: 'x', evals: [{ id: 0, prompt: 'p', expected_output: 'e', assertions: [{ type: 'min-chars', count: -1 }] }] },
      '$.evals[0].assertions[0].count',
    ],
  ])('rejects input when %s and reports the JSON path', (_label, input, path) => {
    expect(() => parseEvalSuite(input)).toThrow(EvalSchemaError);
    try {
      parseEvalSuite(input);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EvalSchemaError);
      expect((error as EvalSchemaError).path).toBe(path);
    }
  });

  const withAssertions = (assertions: unknown[]): unknown => ({
    skill_name: 'x',
    evals: [{ id: 0, prompt: 'p', expected_output: 'e', assertions }],
  });

  it('rejects unknown assertion keys so a typo cannot weaken a check', () => {
    expect(() => parseEvalSuite(withAssertions([{ type: 'contains', value: 'a', ignorecase: true }]))).toThrow(
      /\$\.evals\[0\]\.assertions\[0\]\.ignorecase: unknown key/,
    );
  });

  it('lets unknown eval-case keys pass through for newer skill-creator fields', () => {
    const input = { skill_name: 'x', evals: [{ id: 0, prompt: 'p', expected_output: 'e', future_field: 1 }] };

    expect(() => parseEvalSuite(input)).not.toThrow();
  });

  it.each(['g', 'y', 'gi'])('rejects stateful regex flag %s', (flags) => {
    expect(() => parseEvalSuite(withAssertions([{ type: 'regex', pattern: 'a', flags }]))).toThrow(/not allowed/);
  });

  it('accepts flags on heading for case-insensitive matching', () => {
    const suite = parseEvalSuite(withAssertions([{ type: 'heading', pattern: 'faq', flags: 'i' }]));

    expect(suite.evals[0]?.assertions[0]).toEqual({ type: 'heading', pattern: 'faq', flags: 'i' });
  });

  it('rejects duplicate assertion names within an eval because names key the baseline', () => {
    const input = withAssertions([
      { type: 'contains', value: 'a' },
      { type: 'contains', value: 'a' },
    ]);

    expect(() => parseEvalSuite(input)).toThrow('duplicate assertion name "contains "a""');
  });

  it('rejects duplicate eval ids', () => {
    const input = {
      skill_name: 'x',
      evals: [
        { id: 0, prompt: 'p', expected_output: 'e' },
        { id: 0, prompt: 'q', expected_output: 'e' },
      ],
    };

    expect(() => parseEvalSuite(input)).toThrow(/duplicate eval id 0/);
  });
});
