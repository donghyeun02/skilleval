import { checkAssertion } from './graders/assertions.js';
import type { AssertionResult } from './graders/assertions.js';
import { VARIANTS } from './runners/types.js';
import type { Runner, Variant } from './runners/types.js';
import type { EvalCase, EvalSuite } from './schema/evals.js';

/** Bumped when the JSON report shape changes in a way that breaks `--baseline`. */
export const REPORT_SCHEMA_VERSION = 1;

export interface VariantResult {
  readonly variant: Variant;
  readonly source: string;
  readonly assertions: readonly AssertionResult[];
  readonly passed: number;
  readonly total: number;
}

export interface EvalResult {
  readonly id: number;
  readonly prompt: string;
  readonly variants: readonly VariantResult[];
  /** skill-creator `expectations` need a human or a judge model; we report them, we do not grade them. */
  readonly ungradedExpectations: readonly string[];
}

export interface PassSummary {
  readonly passed: number;
  readonly total: number;
  /** 0..1. Zero when total is zero; check `total` before treating it as a score. */
  readonly passRate: number;
}

export interface SuiteReport {
  readonly schemaVersion: typeof REPORT_SCHEMA_VERSION;
  readonly skillName: string;
  readonly generatedAt: string;
  readonly evals: readonly EvalResult[];
  /** Ids of evals that have no assertions and therefore contribute nothing to the pass rate. */
  readonly evalsWithoutAssertions: readonly number[];
  readonly summary: Partial<Readonly<Record<Variant, PassSummary>>>;
}

export interface EvaluateOptions {
  readonly variants?: readonly Variant[];
  readonly now?: Date;
}

async function gradeVariant(evalCase: EvalCase, variant: Variant, runner: Runner): Promise<VariantResult> {
  const output = await runner.run(evalCase, variant);
  const assertions = evalCase.assertions.map((assertion) => checkAssertion(assertion, output.text));
  return {
    variant,
    source: output.source,
    assertions,
    passed: assertions.filter((result) => result.passed).length,
    total: assertions.length,
  };
}

function summarise(evals: readonly EvalResult[], variant: Variant): PassSummary {
  const results = evals.flatMap((evalResult) => evalResult.variants.filter((v) => v.variant === variant));
  const passed = results.reduce((sum, r) => sum + r.passed, 0);
  const total = results.reduce((sum, r) => sum + r.total, 0);
  return { passed, total, passRate: total === 0 ? 0 : passed / total };
}

/** Runs every eval under each variant and grades the outputs with deterministic assertions. */
export async function evaluateSuite(
  suite: EvalSuite,
  runner: Runner,
  options: EvaluateOptions = {},
): Promise<SuiteReport> {
  const variants = options.variants ?? VARIANTS;

  const evals: EvalResult[] = [];
  for (const evalCase of suite.evals) {
    const results = await Promise.all(variants.map((variant) => gradeVariant(evalCase, variant, runner)));
    evals.push({
      id: evalCase.id,
      prompt: evalCase.prompt,
      variants: results,
      ungradedExpectations: evalCase.expectations,
    });
  }

  const summary = variants.reduce<Partial<Record<Variant, PassSummary>>>(
    (acc, variant) => ({ ...acc, [variant]: summarise(evals, variant) }),
    {},
  );

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    skillName: suite.skillName,
    generatedAt: (options.now ?? new Date()).toISOString(),
    evals,
    evalsWithoutAssertions: suite.evals.filter((e) => e.assertions.length === 0).map((e) => e.id),
    summary,
  };
}
