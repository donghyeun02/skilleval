/**
 * evals.json schema.
 *
 * The file format is a superset of skill-creator's `evals/evals.json`:
 * `skill_name`, `evals[].id/prompt/expected_output/files/expectations` are read as-is,
 * and `evals[].assertions` adds deterministic checks that this tool can grade without a model.
 *
 * Eval cases are lenient (unknown keys pass through, so newer skill-creator fields don't break us).
 * Assertions are strict (unknown keys are rejected, so a typo can't silently weaken a check).
 */
import { InputError, isRecord } from '../errors.js';

interface Named {
  readonly name?: string;
}

export type Assertion =
  | (Named & { readonly type: 'contains'; readonly value: string; readonly ignoreCase: boolean })
  | (Named & { readonly type: 'not-contains'; readonly value: string; readonly ignoreCase: boolean })
  | (Named & { readonly type: 'regex'; readonly pattern: string; readonly flags?: string })
  | (Named & { readonly type: 'heading'; readonly pattern: string; readonly flags?: string })
  | (Named & { readonly type: 'min-table-rows'; readonly count: number })
  | (Named & { readonly type: 'min-chars'; readonly count: number })
  | (Named & { readonly type: 'max-chars'; readonly count: number });

export type AssertionType = Assertion['type'];

const ALLOWED_KEYS = {
  contains: ['type', 'name', 'value', 'ignore_case'],
  'not-contains': ['type', 'name', 'value', 'ignore_case'],
  regex: ['type', 'name', 'pattern', 'flags'],
  heading: ['type', 'name', 'pattern', 'flags'],
  'min-table-rows': ['type', 'name', 'count'],
  'min-chars': ['type', 'name', 'count'],
  'max-chars': ['type', 'name', 'count'],
} as const satisfies Readonly<Record<AssertionType, readonly string[]>>;

export const ASSERTION_TYPES = Object.keys(ALLOWED_KEYS) as readonly AssertionType[];

/** `g` and `y` make RegExp stateful or anchored, which is never what an assertion means. */
const FORBIDDEN_FLAGS = /[gy]/;

export interface EvalCase {
  readonly id: number;
  readonly prompt: string;
  readonly expectedOutput: string;
  readonly files: readonly string[];
  /** Natural-language checks from skill-creator. Not graded here; reported as ungraded. */
  readonly expectations: readonly string[];
  readonly assertions: readonly Assertion[];
}

export interface EvalSuite {
  readonly skillName: string;
  readonly evals: readonly EvalCase[];
}

export class EvalSchemaError extends InputError {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.path = path;
  }
}

type JsonObject = Readonly<Record<string, unknown>>;

/** The name shown in reports and used as the key when comparing with a baseline. */
export function assertionName(assertion: Assertion): string {
  if (assertion.name !== undefined) return assertion.name;
  switch (assertion.type) {
    case 'contains':
      return `contains "${assertion.value}"`;
    case 'not-contains':
      return `does not contain "${assertion.value}"`;
    case 'regex':
      return `matches /${assertion.pattern}/${assertion.flags ?? ''}`;
    case 'heading':
      return `heading matching /${assertion.pattern}/${assertion.flags ?? ''}`;
    case 'min-table-rows':
      return `table with >= ${String(assertion.count)} rows`;
    case 'min-chars':
      return `at least ${String(assertion.count)} chars`;
    case 'max-chars':
      return `at most ${String(assertion.count)} chars`;
  }
}

function expectObject(value: unknown, path: string): JsonObject {
  if (!isRecord(value)) throw new EvalSchemaError(path, 'expected an object');
  return value;
}

function expectArray(value: unknown, path: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new EvalSchemaError(path, 'expected an array');
  return value;
}

function expectString(value: unknown, path: string, { allowEmpty = false } = {}): string {
  if (typeof value !== 'string') throw new EvalSchemaError(path, 'expected a string');
  if (!allowEmpty && value.trim() === '') throw new EvalSchemaError(path, 'must not be empty');
  return value;
}

function expectCount(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new EvalSchemaError(path, 'expected a non-negative integer');
  }
  return value;
}

function optionalStringArray(value: unknown, path: string): readonly string[] {
  if (value === undefined) return [];
  return expectArray(value, path).map((item, i) => expectString(item, `${path}[${String(i)}]`));
}

function optionalBoolean(value: unknown, path: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') throw new EvalSchemaError(path, 'expected a boolean');
  return value;
}

function rejectUnknownKeys(raw: JsonObject, allowed: readonly string[], path: string): void {
  const unknown = Object.keys(raw).find((key) => !allowed.includes(key));
  if (unknown !== undefined) {
    throw new EvalSchemaError(`${path}.${unknown}`, `unknown key (allowed: ${allowed.join(', ')})`);
  }
}

function parsePattern(raw: JsonObject, path: string): { pattern: string; flags?: string } {
  const pattern = expectString(raw['pattern'], `${path}.pattern`);
  const flags = raw['flags'] === undefined ? undefined : expectString(raw['flags'], `${path}.flags`);
  if (flags !== undefined && FORBIDDEN_FLAGS.test(flags)) {
    throw new EvalSchemaError(`${path}.flags`, 'flags "g" and "y" are not allowed');
  }
  try {
    new RegExp(pattern, flags);
  } catch (error: unknown) {
    throw new EvalSchemaError(`${path}.pattern`, error instanceof Error ? error.message : 'invalid pattern');
  }
  return flags === undefined ? { pattern } : { pattern, flags };
}

function withName<T extends object>(assertion: T, raw: JsonObject, path: string): T & Named {
  if (raw['name'] === undefined) return assertion;
  return { ...assertion, name: expectString(raw['name'], `${path}.name`) };
}

function isAssertionType(value: unknown): value is AssertionType {
  return typeof value === 'string' && Object.hasOwn(ALLOWED_KEYS, value);
}

export function parseAssertion(value: unknown, path: string): Assertion {
  const raw = expectObject(value, path);
  const type = raw['type'];
  if (!isAssertionType(type)) {
    throw new EvalSchemaError(`${path}.type`, `expected one of ${ASSERTION_TYPES.join(', ')}`);
  }
  rejectUnknownKeys(raw, ALLOWED_KEYS[type], path);

  switch (type) {
    case 'contains':
    case 'not-contains': {
      const textValue = expectString(raw['value'], `${path}.value`);
      const ignoreCase = optionalBoolean(raw['ignore_case'], `${path}.ignore_case`);
      return withName({ type, value: textValue, ignoreCase }, raw, path);
    }
    case 'regex':
    case 'heading':
      return withName({ type, ...parsePattern(raw, path) }, raw, path);
    case 'min-table-rows':
    case 'min-chars':
    case 'max-chars':
      return withName({ type, count: expectCount(raw['count'], `${path}.count`) }, raw, path);
  }
}

function parseAssertions(value: unknown, path: string): readonly Assertion[] {
  if (value === undefined) return [];
  const assertions = expectArray(value, path).map((item, i) => parseAssertion(item, `${path}[${String(i)}]`));

  const seen = new Set<string>();
  for (const [i, assertion] of assertions.entries()) {
    const name = assertionName(assertion);
    if (seen.has(name)) {
      throw new EvalSchemaError(`${path}[${String(i)}]`, `duplicate assertion name "${name}" (names key the baseline)`);
    }
    seen.add(name);
  }
  return assertions;
}

function parseEvalCase(value: unknown, path: string): EvalCase {
  const raw = expectObject(value, path);
  const id = raw['id'];
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    throw new EvalSchemaError(`${path}.id`, 'expected an integer');
  }

  return {
    id,
    prompt: expectString(raw['prompt'], `${path}.prompt`),
    expectedOutput: expectString(raw['expected_output'], `${path}.expected_output`, { allowEmpty: true }),
    files: optionalStringArray(raw['files'], `${path}.files`),
    expectations: optionalStringArray(raw['expectations'], `${path}.expectations`),
    assertions: parseAssertions(raw['assertions'], `${path}.assertions`),
  };
}

/** Validates untrusted JSON and converts it to an {@link EvalSuite}. Throws {@link EvalSchemaError}. */
export function parseEvalSuite(input: unknown): EvalSuite {
  const root = expectObject(input, '$');
  const skillName = expectString(root['skill_name'], '$.skill_name');
  const evals = expectArray(root['evals'], '$.evals').map((item, i) => parseEvalCase(item, `$.evals[${String(i)}]`));

  const seen = new Set<number>();
  for (const [i, evalCase] of evals.entries()) {
    if (seen.has(evalCase.id)) {
      throw new EvalSchemaError(`$.evals[${String(i)}].id`, `duplicate eval id ${String(evalCase.id)}`);
    }
    seen.add(evalCase.id);
  }

  return { skillName, evals };
}
