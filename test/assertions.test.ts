import { describe, expect, it } from 'vitest';
import { checkAssertion, tableRowCounts } from '../src/graders/assertions.js';

const doc = [
  '# 매치3 레퍼런스',
  '',
  '## 차별화 기회',
  '- Royal Match보다 짧은 세션',
  '',
  '| 게임 | 순위 |',
  '|---|---|',
  '| Royal Match | 3 |',
  '| Toon Blast | 8 |',
  '',
  '출처: https://sensortower.com/blog',
].join('\n');

describe('checkAssertion', () => {
  it('contains passes and points at the matching line', () => {
    const result = checkAssertion({ type: 'contains', value: 'Toon Blast', ignoreCase: false }, doc);

    expect(result.passed).toBe(true);
    expect(result.evidence).toContain('line 9');
  });

  it('contains respects ignoreCase', () => {
    expect(checkAssertion({ type: 'contains', value: 'royal match', ignoreCase: false }, doc).passed).toBe(false);
    expect(checkAssertion({ type: 'contains', value: 'royal match', ignoreCase: true }, doc).passed).toBe(true);
  });

  it('not-contains fails when the text is present', () => {
    const result = checkAssertion({ type: 'not-contains', value: 'Royal', ignoreCase: false }, doc);

    expect(result.passed).toBe(false);
    expect(result.evidence).toContain('line 4');
  });

  it('regex supports flags', () => {
    expect(checkAssertion({ type: 'regex', pattern: 'https?://\\S+' }, doc).passed).toBe(true);
    expect(checkAssertion({ type: 'regex', pattern: '^출처', flags: 'm' }, doc).passed).toBe(true);
    expect(checkAssertion({ type: 'regex', pattern: '^출처' }, doc).passed).toBe(false);
  });

  it('heading only looks at markdown headings, not body text', () => {
    expect(checkAssertion({ type: 'heading', pattern: '차별화' }, doc).passed).toBe(true);
    expect(checkAssertion({ type: 'heading', pattern: 'Royal' }, doc).passed).toBe(false);
  });

  it('min-table-rows counts data rows of the largest table, excluding header and separator', () => {
    expect(checkAssertion({ type: 'min-table-rows', count: 2 }, doc).passed).toBe(true);

    const result = checkAssertion({ type: 'min-table-rows', count: 3 }, doc);
    expect(result.passed).toBe(false);
    expect(result.evidence).toContain('largest table has 2 data rows');
  });

  it('ignores headings and tables inside fenced code blocks', () => {
    const fenced = ['```bash', '# install deps', '| a | b |', '|---|---|', '| 1 | 2 |', '```', '~~~', '# also code', '~~~'].join(
      '\n',
    );

    expect(checkAssertion({ type: 'heading', pattern: 'install' }, fenced).passed).toBe(false);
    expect(checkAssertion({ type: 'heading', pattern: 'also' }, fenced).passed).toBe(false);
    expect(tableRowCounts(fenced)).toEqual([]);
  });

  it('heading supports flags for case-insensitive matching', () => {
    expect(checkAssertion({ type: 'heading', pattern: 'faq', flags: 'i' }, '## FAQ').passed).toBe(true);
  });

  it.each([
    ['tables without outer pipes', 'a | b\n--|--\n1 | 2\n3 | 4', [2]],
    ['single-dash separators', '|a|b|\n|-|-|\n|1|2|', [1]],
    ['alignment colons', '| a | b |\n|:--|--:|\n| 1 | 2 |', [1]],
    ['a horizontal rule under a pipe line is not a table', '| title\n---\ntext', []],
    ['header and separator cell counts must match', '| a | b |\n|---|\n| 1 | 2 |', []],
    ['rows stop at a blank line', '|a|b|\n|-|-|\n|1|2|\n\n|3|4|', [1]],
  ])('tableRowCounts handles %s', (_label, text, expected) => {
    expect(tableRowCounts(text)).toEqual(expected);
  });

  it('min-table-rows reports when there is no table', () => {
    const result = checkAssertion({ type: 'min-table-rows', count: 1 }, 'no table here');

    expect(result.passed).toBe(false);
    expect(result.evidence).toContain('no markdown table');
  });

  it('min-chars and max-chars count user-perceived characters, not bytes or code units', () => {
    expect(checkAssertion({ type: 'min-chars', count: 3 }, '가나다').passed).toBe(true);
    expect(checkAssertion({ type: 'max-chars', count: 3 }, '가나다').passed).toBe(true);
    expect(checkAssertion({ type: 'max-chars', count: 2 }, '가나다').passed).toBe(false);
    expect(checkAssertion({ type: 'max-chars', count: 1 }, '👍🏽').evidence).toBe('1 chars');
  });

  it('uses the custom name when given, otherwise a readable default', () => {
    expect(checkAssertion({ type: 'heading', pattern: 'x', name: '차별화 섹션' }, doc).name).toBe('차별화 섹션');
    expect(checkAssertion({ type: 'min-table-rows', count: 3 }, doc).name).toBe('table with >= 3 rows');
  });
});
