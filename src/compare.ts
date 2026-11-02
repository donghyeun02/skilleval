import { InputError, isRecord } from './errors.js';
import { REPORT_SCHEMA_VERSION } from './grade.js';
import type { SuiteReport } from './grade.js';

const FLOAT_EPSILON = 1e-9;

export class BaselineError extends InputError {}

export interface CompareOptions {
  /**
   * Share of baseline-passing assertions allowed to start failing, 0..1.
   * 0 means any single pass → fail flip is a regression.
   */
  readonly tolerance: number;
}

export interface AssertionKey {
  readonly evalId: number;
  readonly assertion: string;
}

export interface CompareResult {
  /** Aggregate with_skill pass rates, for display. Not used to decide regression. */
  readonly baseline: number;
  readonly current: number;
  readonly delta: number;
  /** Passed in the baseline, fails now. */
  readonly newlyFailing: readonly AssertionKey[];
  /** Failed in the baseline, passes now. Reported, but never offsets newlyFailing. */
  readonly newlyPassing: readonly AssertionKey[];
  /** Assertions present in both reports. */
  readonly compared: number;
  readonly regressed: boolean;
}

/** with_skill pass/fail per (eval id, assertion name). */
type Outcomes = ReadonlyMap<string, { readonly key: AssertionKey; readonly passed: boolean }>;

interface ParsedBaseline {
  readonly skillName: string;
  readonly passRate: number;
  readonly outcomes: Outcomes;
}

function keyOf(key: AssertionKey): string {
  return `${String(key.evalId)}\u0000${key.assertion}`;
}

function bad(message: string): BaselineError {
  return new BaselineError(`baseline ${message}`);
}

function readArray(value: unknown, what: string): readonly unknown[] {
  if (!Array.isArray(value)) throw bad(`is missing ${what}`);
  return value;
}

function readOutcomes(evals: readonly unknown[]): Outcomes {
  const outcomes = new Map<string, { key: AssertionKey; passed: boolean }>();
  for (const evalResult of evals) {
    if (!isRecord(evalResult) || typeof evalResult['id'] !== 'number') throw bad('has an eval without a numeric id');
    const evalId = evalResult['id'];
    const withSkill = readArray(evalResult['variants'], `evals[id=${String(evalId)}].variants`).find(
      (v) => isRecord(v) && v['variant'] === 'with_skill',
    );
    if (!isRecord(withSkill)) continue;

    for (const result of readArray(withSkill['assertions'], 'assertions')) {
      if (!isRecord(result) || typeof result['name'] !== 'string' || typeof result['passed'] !== 'boolean') {
        throw bad(`has a malformed assertion in eval ${String(evalId)}`);
      }
      const key = { evalId, assertion: result['name'] };
      outcomes.set(keyOf(key), { key, passed: result['passed'] });
    }
  }
  return outcomes;
}

function parseBaseline(input: unknown): ParsedBaseline {
  if (!isRecord(input)) throw bad('is not a JSON object');
  if (input['schemaVersion'] !== REPORT_SCHEMA_VERSION) {
    throw bad(`schemaVersion is ${JSON.stringify(input['schemaVersion'])}, expected ${String(REPORT_SCHEMA_VERSION)}`);
  }
  if (typeof input['skillName'] !== 'string') throw bad('is missing skillName');

  const summary = input['summary'];
  const withSkill = isRecord(summary) ? summary['with_skill'] : undefined;
  const passRate = isRecord(withSkill) ? withSkill['passRate'] : undefined;
  const total = isRecord(withSkill) ? withSkill['total'] : undefined;
  if (typeof passRate !== 'number' || !Number.isFinite(passRate) || passRate < 0 || passRate > 1) {
    throw bad('has no summary.with_skill.passRate between 0 and 1');
  }
  if (typeof total !== 'number' || total === 0) throw bad('has no graded with_skill assertions');

  return { skillName: input['skillName'], passRate, outcomes: readOutcomes(readArray(input['evals'], 'evals')) };
}

function currentOutcomes(report: SuiteReport): Outcomes {
  const outcomes = new Map<string, { key: AssertionKey; passed: boolean }>();
  for (const evalResult of report.evals) {
    for (const result of evalResult.variants.find((v) => v.variant === 'with_skill')?.assertions ?? []) {
      const key = { evalId: evalResult.id, assertion: result.name };
      outcomes.set(keyOf(key), { key, passed: result.passed });
    }
  }
  return outcomes;
}

/**
 * Compares with_skill results assertion by assertion against a previous JSON report.
 * The baseline is `unknown` because it is usually read from disk; it is validated here.
 */
export function compareToBaseline(current: SuiteReport, baselineInput: unknown, options: CompareOptions): CompareResult {
  if (!(options.tolerance >= 0 && options.tolerance <= 1)) {
    throw new InputError(`tolerance must be between 0 and 1, got ${String(options.tolerance)}`);
  }
  const currentSummary = current.summary.with_skill;
  if (currentSummary === undefined || currentSummary.total === 0) {
    throw new InputError('current run has no graded with_skill assertions to compare');
  }

  const baseline = parseBaseline(baselineInput);
  if (baseline.skillName !== current.skillName) {
    throw bad(`is for skill "${baseline.skillName}", not "${current.skillName}"`);
  }

  const now = currentOutcomes(current);
  const shared = [...baseline.outcomes].flatMap(([k, before]) => {
    const after = now.get(k);
    return after === undefined ? [] : [{ key: before.key, before: before.passed, after: after.passed }];
  });
  if (shared.length === 0) throw bad('has no assertions in common with the current run');

  const newlyFailing = shared.filter((s) => s.before && !s.after).map((s) => s.key);
  const newlyPassing = shared.filter((s) => !s.before && s.after).map((s) => s.key);
  const baselinePassed = shared.filter((s) => s.before).length;
  const failingShare = baselinePassed === 0 ? 0 : newlyFailing.length / baselinePassed;

  return {
    baseline: baseline.passRate,
    current: currentSummary.passRate,
    delta: currentSummary.passRate - baseline.passRate,
    newlyFailing,
    newlyPassing,
    compared: shared.length,
    // Ratios of small integers: 1/10 must not read as 0.10000000000000009 > 0.1.
    regressed: failingShare > options.tolerance + FLOAT_EPSILON,
  };
}
