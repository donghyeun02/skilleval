import type { CompareResult } from '../compare.js';
import type { EvalResult, SuiteReport, VariantResult } from '../grade.js';
import { VARIANTS } from '../runners/types.js';

const PROMPT_PREVIEW_LENGTH = 50;

function percent(rate: number): string {
  return `${String(Math.round(rate * 100))}%`;
}

function escapeCell(text: string): string {
  return text.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function preview(prompt: string): string {
  const flat = prompt.replaceAll('\n', ' ');
  return flat.length > PROMPT_PREVIEW_LENGTH ? `${flat.slice(0, PROMPT_PREVIEW_LENGTH)}…` : flat;
}

function summaryTable(report: SuiteReport): string[] {
  const rows = VARIANTS.flatMap((variant) => {
    const s = report.summary[variant];
    return s === undefined ? [] : [`| ${variant} | ${String(s.passed)}/${String(s.total)} | ${percent(s.passRate)} |`];
  });
  return ['| variant | passed | pass rate |', '|---|---|---|', ...rows];
}

function compareLines(compare: CompareResult): string[] {
  const verdict = compare.regressed ? '**REGRESSION**' : 'OK';
  const flips = (label: string, keys: CompareResult['newlyFailing']): string[] =>
    keys.map((k) => `- ${label} eval ${String(k.evalId)} · ${k.assertion}`);
  return [
    '',
    `Baseline: ${percent(compare.baseline)} → ${percent(compare.current)} (${verdict}, ${String(compare.compared)} assertions compared)`,
    ...flips('newly failing:', compare.newlyFailing),
    ...flips('newly passing:', compare.newlyPassing),
  ];
}

function variantCell(result: VariantResult | undefined): string {
  return result === undefined ? '-' : `${String(result.passed)}/${String(result.total)}`;
}

function evalTable(report: SuiteReport): string[] {
  const graded = VARIANTS.filter((variant) => report.summary[variant] !== undefined);
  const header = [`| eval | prompt | ${graded.join(' | ')} |`, `|---|---|${graded.map(() => '---|').join('')}`];
  const rows = report.evals.map((e) => {
    const cells = graded.map((variant) => variantCell(e.variants.find((v) => v.variant === variant)));
    return `| ${String(e.id)} | ${escapeCell(preview(e.prompt))} | ${cells.join(' | ')} |`;
  });
  return [...header, ...rows];
}

function failures(evalResult: EvalResult): string[] {
  return evalResult.variants.flatMap((v) =>
    v.assertions
      .filter((a) => !a.passed)
      .map((a) => `- eval ${String(evalResult.id)} · ${v.variant}: ❌ ${a.name} — ${a.evidence}`),
  );
}

function warnings(report: SuiteReport): string[] {
  const lines: string[] = [];
  for (const id of report.evalsWithoutAssertions) {
    lines.push(`- eval ${String(id)} has no assertions and is not counted.`);
  }
  for (const e of report.evals) {
    for (const expectation of e.ungradedExpectations) {
      lines.push(`- eval ${String(e.id)} ungraded expectation: ${expectation}`);
    }
  }
  return lines;
}

function section(title: string, lines: readonly string[]): string[] {
  return lines.length === 0 ? [] : ['', `## ${title}`, '', ...lines];
}

export function renderMarkdown(report: SuiteReport, compare?: CompareResult): string {
  const lines = [
    `# skilleval: ${report.skillName}`,
    '',
    `Generated ${report.generatedAt}`,
    '',
    ...summaryTable(report),
    ...(compare === undefined ? [] : compareLines(compare)),
    '',
    '## Evals',
    '',
    ...evalTable(report),
    ...section('Failed assertions', report.evals.flatMap(failures)),
    ...section('Not graded', warnings(report)),
  ];
  return `${lines.join('\n')}\n`;
}
