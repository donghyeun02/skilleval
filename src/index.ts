export { InputError } from './errors.js';

export { parseEvalSuite, parseAssertion, assertionName, EvalSchemaError, ASSERTION_TYPES } from './schema/evals.js';
export type { Assertion, AssertionType, EvalCase, EvalSuite } from './schema/evals.js';

export { checkAssertion, tableRowCounts, maskFencedCode } from './graders/assertions.js';
export type { AssertionResult } from './graders/assertions.js';

export { VARIANTS, isVariant } from './runners/types.js';
export type { Runner, RunOutput, Variant } from './runners/types.js';
export { FixtureRunner, FixtureNotFoundError } from './runners/fixture.js';

export { evaluateSuite, REPORT_SCHEMA_VERSION } from './grade.js';
export type { EvalResult, EvaluateOptions, PassSummary, SuiteReport, VariantResult } from './grade.js';

export { compareToBaseline, BaselineError } from './compare.js';
export type { AssertionKey, CompareOptions, CompareResult } from './compare.js';

export { renderMarkdown } from './report/markdown.js';
