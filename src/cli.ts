import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { compareToBaseline } from './compare.js';
import type { CompareResult } from './compare.js';
import { InputError, fsError } from './errors.js';
import { evaluateSuite } from './grade.js';
import { renderMarkdown } from './report/markdown.js';
import { FixtureRunner } from './runners/fixture.js';
import { VARIANTS, isVariant } from './runners/types.js';
import type { Variant } from './runners/types.js';
import { parseEvalSuite } from './schema/evals.js';

/** 1 is reserved for "regression" so CI can tell a worse skill from a broken run. */
export const EXIT = { ok: 0, regression: 1, usage: 2, internal: 70 } as const;
export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

export interface Io {
  stdout(text: string): void;
  stderr(text: string): void;
}

const HELP = `Usage: skilleval grade --evals <evals.json> --fixtures <dir> [options]

Grade existing skill outputs with the deterministic assertions in evals.json.

Options:
  --evals <path>         evals.json (skill-creator format + "assertions")
  --fixtures <dir>       folder with eval-<id>/<variant>/outputs/*.md
  --variants <list>      comma-separated, default: with_skill,without_skill
  --format <md|json>     report format (default: md)
  --out <path>           write the report to a file instead of stdout
  --baseline <path>      previous JSON report; exit 1 if with_skill assertions start failing
  --tolerance <0..1>     share of baseline-passing assertions allowed to flip (default: 0)
  -h, --help             show this help

Exit codes: 0 ok · 1 regression · 2 usage or input error · 70 internal error
`;

const DECIMAL = /^(?:\d+\.?\d*|\.\d+)$/;

interface GradeArgs {
  readonly evals: string;
  readonly fixtures: string;
  readonly variants: readonly Variant[];
  readonly format: 'md' | 'json';
  readonly out: string | undefined;
  readonly baseline: string | undefined;
  readonly tolerance: number;
}

function parseVariants(value: string): readonly Variant[] {
  const parts = value.split(',').map((part) => part.trim());
  const invalid = parts.find((part) => !isVariant(part));
  if (invalid !== undefined) throw new InputError(`--variants: unknown variant "${invalid}" (use ${VARIANTS.join(', ')})`);
  return [...new Set(parts.filter(isVariant))];
}

function parseTolerance(value: string): number {
  const tolerance = Number(value);
  if (!DECIMAL.test(value) || tolerance > 1) throw new InputError('--tolerance must be a number between 0 and 1');
  return tolerance;
}

function parseGradeArgs(values: Readonly<Record<string, unknown>>): GradeArgs {
  const text = (key: string): string | undefined => {
    const value = values[key];
    return typeof value === 'string' ? value : undefined;
  };
  const evals = text('evals');
  const fixtures = text('fixtures');
  const format = text('format') ?? 'md';
  if (evals === undefined) throw new InputError('--evals is required');
  if (fixtures === undefined) throw new InputError('--fixtures is required');
  if (format !== 'md' && format !== 'json') throw new InputError('--format must be md or json');

  return {
    evals,
    fixtures,
    variants: parseVariants(text('variants') ?? VARIANTS.join(',')),
    format,
    out: text('out'),
    baseline: text('baseline'),
    tolerance: parseTolerance(text('tolerance') ?? '0'),
  };
}

async function readJson(path: string, label: string): Promise<unknown> {
  let content: string;
  try {
    content = await readFile(path, 'utf8');
  } catch (error: unknown) {
    throw fsError(`read ${label}`, path, error);
  }
  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new InputError(`${label} at ${path} is not valid JSON`);
  }
}

async function grade(args: GradeArgs, io: Io): Promise<ExitCode> {
  const suite = parseEvalSuite(await readJson(args.evals, 'evals'));
  const report = await evaluateSuite(suite, new FixtureRunner(args.fixtures), { variants: args.variants });

  const compare: CompareResult | undefined =
    args.baseline === undefined
      ? undefined
      : compareToBaseline(report, await readJson(args.baseline, 'baseline'), { tolerance: args.tolerance });

  const body =
    args.format === 'json'
      ? `${JSON.stringify(compare === undefined ? report : { ...report, compare }, null, 2)}\n`
      : renderMarkdown(report, compare);

  if (args.out === undefined) {
    io.stdout(body);
  } else {
    try {
      await writeFile(args.out, body);
    } catch (error: unknown) {
      throw fsError('write report to', args.out, error);
    }
    io.stderr(`report written to ${args.out}\n`);
  }

  return compare?.regressed === true ? EXIT.regression : EXIT.ok;
}

function parseCommandLine(argv: readonly string[]): ReturnType<typeof parseArgs> {
  try {
    return parseArgs({
      args: [...argv],
      allowPositionals: true,
      strict: true,
      options: {
        evals: { type: 'string' },
        fixtures: { type: 'string' },
        variants: { type: 'string' },
        format: { type: 'string' },
        out: { type: 'string' },
        baseline: { type: 'string' },
        tolerance: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (error: unknown) {
    // node:util parseArgs throws TypeError for unknown or malformed options.
    throw new InputError(error instanceof Error ? error.message : 'invalid arguments');
  }
}

/** Entry point with injectable IO so it can be tested without spawning a process. */
export async function main(argv: readonly string[], io: Io): Promise<ExitCode> {
  try {
    const { values, positionals } = parseCommandLine(argv);
    const [command, ...extra] = positionals;

    if (values['help'] === true || command === undefined) {
      io.stdout(HELP);
      return EXIT.ok;
    }
    if (command !== 'grade') throw new InputError(`unknown command "${command}". Run skilleval --help`);
    if (extra.length > 0) throw new InputError(`unexpected argument "${extra.join(' ')}"`);

    return await grade(parseGradeArgs(values), io);
  } catch (error: unknown) {
    if (!(error instanceof InputError)) throw error;
    io.stderr(`skilleval: ${error.message}\n`);
    return EXIT.usage;
  }
}
