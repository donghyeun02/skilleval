import { assertionName } from '../schema/evals.js';
import type { Assertion } from '../schema/evals.js';

export interface AssertionResult {
  readonly name: string;
  readonly passed: boolean;
  /** Short, human-readable reason. Points at a line number when possible. */
  readonly evidence: string;
}

const HEADING_LINE = /^ {0,3}#{1,6}\s+(.*)$/;
const FENCE_LINE = /^ {0,3}(`{3,}|~{3,})/;
const SEPARATOR_CELL = /^\s*:?-+:?\s*$/;
const SNIPPET_LENGTH = 60;

// Fixed locale so the count never depends on the machine running the grader.
const graphemes = new Intl.Segmenter('en', { granularity: 'grapheme' });

/** User-perceived characters: "👍🏽" and "가" each count as 1. */
function countGraphemes(text: string): number {
  return Array.from(graphemes.segment(text)).length;
}

/**
 * Replaces lines inside fenced code blocks (and the fences) with '' so that
 * `# comment` in a bash block is not a heading. Keeps line numbers stable.
 */
export function maskFencedCode(lines: readonly string[]): readonly string[] {
  let openFence: string | undefined;
  return lines.map((line) => {
    const fence = FENCE_LINE.exec(line)?.[1];
    if (openFence === undefined) {
      if (fence === undefined) return line;
      openFence = fence;
      return '';
    }
    // A fence closes only with the same character and at least the same length (CommonMark).
    if (fence?.startsWith(openFence.charAt(0)) === true && fence.length >= openFence.length) openFence = undefined;
    return '';
  });
}

function splitCells(line: string): readonly string[] {
  let inner = line.trim();
  if (inner.startsWith('|')) inner = inner.slice(1);
  if (inner.endsWith('|') && !inner.endsWith('\\|')) inner = inner.slice(0, -1);
  return inner.split(/(?<!\\)\|/);
}

function isSeparator(line: string): boolean {
  return line.includes('|') && splitCells(line).every((cell) => SEPARATOR_CELL.test(cell));
}

function isTableStart(header: string, separator: string): boolean {
  return (
    header.includes('|') &&
    !isSeparator(header) &&
    isSeparator(separator) &&
    splitCells(header).length === splitCells(separator).length
  );
}

/** Data-row counts of each GFM table (header and separator rows excluded, code blocks ignored). */
export function tableRowCounts(text: string): readonly number[] {
  const lines = maskFencedCode(text.split('\n'));
  const counts: number[] = [];
  let i = 0;
  while (i < lines.length) {
    if (!isTableStart(lines[i] ?? '', lines[i + 1] ?? '')) {
      i += 1;
      continue;
    }
    let j = i + 2;
    while ((lines[j] ?? '').trim() !== '' && (lines[j] ?? '').includes('|')) j += 1;
    counts.push(j - (i + 2));
    i = j;
  }
  return counts;
}

function snippet(line: string): string {
  const trimmed = line.trim();
  return trimmed.length > SNIPPET_LENGTH ? `${trimmed.slice(0, SNIPPET_LENGTH)}…` : trimmed;
}

/** 1-based line number of the first line that satisfies `predicate`, or undefined. */
function findLine(lines: readonly string[], predicate: (line: string) => boolean): number | undefined {
  const index = lines.findIndex(predicate);
  return index === -1 ? undefined : index + 1;
}

function lineEvidence(lines: readonly string[], lineNumber: number): string {
  return `line ${String(lineNumber)}: ${snippet(lines[lineNumber - 1] ?? '')}`;
}

function evaluate(assertion: Assertion, text: string): Omit<AssertionResult, 'name'> {
  const lines = text.split('\n');

  switch (assertion.type) {
    case 'contains':
    case 'not-contains': {
      const needle = assertion.ignoreCase ? assertion.value.toLowerCase() : assertion.value;
      const lineNumber = findLine(lines, (line) =>
        (assertion.ignoreCase ? line.toLowerCase() : line).includes(needle),
      );
      const found = lineNumber !== undefined;
      const evidence = found ? lineEvidence(lines, lineNumber) : 'not found';
      return { passed: assertion.type === 'contains' ? found : !found, evidence };
    }
    case 'regex': {
      const match = new RegExp(assertion.pattern, assertion.flags).exec(text);
      if (match === null) return { passed: false, evidence: 'no match' };
      const lineNumber = text.slice(0, match.index).split('\n').length;
      return { passed: true, evidence: lineEvidence(lines, lineNumber) };
    }
    case 'heading': {
      const pattern = new RegExp(assertion.pattern, assertion.flags);
      const lineNumber = findLine(maskFencedCode(lines), (line) => {
        const heading = HEADING_LINE.exec(line);
        return heading !== null && pattern.test(heading[1] ?? '');
      });
      return lineNumber === undefined
        ? { passed: false, evidence: 'no matching heading' }
        : { passed: true, evidence: lineEvidence(lines, lineNumber) };
    }
    case 'min-table-rows': {
      const counts = tableRowCounts(text);
      if (counts.length === 0) return { passed: false, evidence: 'no markdown table found' };
      const largest = Math.max(...counts);
      return {
        passed: largest >= assertion.count,
        evidence: `largest table has ${String(largest)} data rows (${String(counts.length)} tables)`,
      };
    }
    case 'min-chars':
    case 'max-chars': {
      const length = countGraphemes(text);
      const passed = assertion.type === 'min-chars' ? length >= assertion.count : length <= assertion.count;
      return { passed, evidence: `${String(length)} chars` };
    }
  }
}

/** Grades one assertion against one output. Pure and deterministic. */
export function checkAssertion(assertion: Assertion, text: string): AssertionResult {
  return { name: assertionName(assertion), ...evaluate(assertion, text) };
}
