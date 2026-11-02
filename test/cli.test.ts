import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EXIT, main } from '../src/cli.js';
import type { Io } from '../src/cli.js';

interface CapturedIo extends Io {
  readonly out: string[];
  readonly err: string[];
}

function captureIo(): CapturedIo {
  const out: string[] = [];
  const err: string[] = [];
  return { out, err, stdout: (t) => out.push(t), stderr: (t) => err.push(t) };
}

describe('cli main', () => {
  let root: string;
  let evalsPath: string;
  let fixtures: string;
  let grade: (...extra: string[]) => string[];

  const writeResult = (variant: string, text: string): void => {
    mkdirSync(join(fixtures, 'eval-0', variant, 'outputs'), { recursive: true });
    writeFileSync(join(fixtures, 'eval-0', variant, 'outputs', 'result.md'), text);
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'skilleval-cli-'));
    evalsPath = join(root, 'evals.json');
    fixtures = join(root, 'runs');
    grade = (...extra) => ['grade', '--evals', evalsPath, '--fixtures', fixtures, ...extra];
    writeFileSync(
      evalsPath,
      JSON.stringify({
        skill_name: 'demo',
        evals: [{ id: 0, prompt: 'p', expected_output: 'e', assertions: [{ type: 'contains', value: 'OK' }] }],
      }),
    );
    writeResult('with_skill', 'OK');
    writeResult('without_skill', 'nope');
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('prints a markdown report and exits 0', async () => {
    const io = captureIo();

    expect(await main(grade(), io)).toBe(EXIT.ok);
    expect(io.out.join('')).toContain('| with_skill | 1/1 | 100% |');
  });

  it('writes JSON to --out that works as the next --baseline', async () => {
    const out = join(root, 'report.json');
    await main(grade('--format', 'json', '--out', out), captureIo());

    const code = await main(grade('--baseline', out), captureIo());

    expect(JSON.parse(readFileSync(out, 'utf8'))).toMatchObject({ schemaVersion: 1, summary: { with_skill: { passRate: 1 } } });
    expect(code).toBe(EXIT.ok);
  });

  it('exits 1 only when a baseline-passing assertion starts failing', async () => {
    const baseline = join(root, 'baseline.json');
    await main(grade('--format', 'json', '--out', baseline), captureIo());
    writeResult('with_skill', 'broken');
    const io = captureIo();

    const code = await main(grade('--baseline', baseline), io);

    expect(code).toBe(EXIT.regression);
    expect(io.out.join('')).toContain('newly failing: eval 0 · contains "OK"');
  });

  it('--variants grades only the listed variants, so without_skill outputs are optional', async () => {
    rmSync(join(fixtures, 'eval-0', 'without_skill'), { recursive: true });
    const io = captureIo();

    expect(await main(grade('--variants', 'with_skill'), io)).toBe(EXIT.ok);
    expect(io.out.join('')).not.toContain('| without_skill |');
  });

  interface UsageCase {
    readonly label: string;
    readonly argv: readonly string[];
    readonly message: RegExp;
  }

  const usageCases: readonly UsageCase[] = [
    { label: 'missing --evals', argv: ['grade', '--fixtures', 'x'], message: /--evals is required/ },
    { label: 'missing --fixtures', argv: ['grade', '--evals', 'x'], message: /--fixtures is required/ },
    { label: 'unknown command', argv: ['nope'], message: /unknown command/ },
    { label: 'unknown option', argv: ['grade', '--evlas', 'x'], message: /Unknown option/ },
    { label: 'extra positional', argv: ['grade', 'extra', '--evals', 'x', '--fixtures', 'y'], message: /unexpected argument/ },
    { label: 'bad format', argv: ['grade', '--evals', 'x', '--fixtures', 'y', '--format', 'xml'], message: /--format must be/ },
    {
      label: 'bad variant',
      argv: ['grade', '--evals', 'x', '--fixtures', 'y', '--variants', 'with_skil'],
      message: /unknown variant "with_skil"/,
    },
    ...['abc', '', ' ', '0x1', '1.5', '-0.1'].map((t) => ({
      label: `tolerance ${JSON.stringify(t)}`,
      argv: ['grade', '--evals', 'x', '--fixtures', 'y', '--tolerance', t],
      message: /--tolerance/,
    })),
  ];

  it.each(usageCases)('exits 2 for $label', async ({ argv, message }) => {
    const io = captureIo();

    expect(await main(argv, io)).toBe(EXIT.usage);
    expect(io.err.join('')).toMatch(message);
  });

  interface InputCase {
    readonly label: string;
    /** Runs after beforeEach; returns extra CLI arguments. */
    readonly arrange: () => readonly string[];
    readonly message: RegExp;
  }

  const inputCases: readonly InputCase[] = [
    {
      label: 'invalid evals.json names the JSON path',
      arrange: () => {
        writeFileSync(evalsPath, '{"skill_name":"x","evals":[{"id":"a"}]}');
        return [];
      },
      message: /\$\.evals\[0\]\.id/,
    },
    {
      label: 'evals.json is not JSON',
      arrange: () => {
        writeFileSync(evalsPath, '{');
        return [];
      },
      message: /not valid JSON/,
    },
    {
      label: 'a fixture is missing',
      arrange: () => {
        rmSync(join(fixtures, 'eval-0', 'without_skill'), { recursive: true });
        return [];
      },
      message: /without_skill/,
    },
    {
      label: '--fixtures points at a file',
      arrange: () => {
        writeFileSync(join(root, 'file'), 'x');
        return ['--fixtures', join(root, 'file')];
      },
      message: /ENOTDIR/,
    },
    {
      label: 'baseline is {}',
      arrange: () => {
        writeFileSync(join(root, 'b.json'), '{}');
        return ['--baseline', join(root, 'b.json')];
      },
      message: /schemaVersion/,
    },
    { label: 'baseline file is missing', arrange: () => ['--baseline', join(root, 'missing.json')], message: /ENOENT/ },
    { label: '--out directory does not exist', arrange: () => ['--out', join(root, 'nope', 'r.md')], message: /cannot write report/ },
  ];

  it.each(inputCases)('exits 2, not 1, when $label', async ({ arrange, message }) => {
    const extra = arrange();
    const io = captureIo();

    const code = await main(grade(...extra), io);

    expect(code).toBe(EXIT.usage);
    expect(io.err.join('')).toMatch(message);
  });

  it.each([[['--help']], [['-h']], [['grade', '-h']], [[]]])('prints help for %j', async (argv) => {
    const io = captureIo();

    expect(await main(argv, io)).toBe(EXIT.ok);
    expect(io.out.join('')).toContain('Usage: skilleval grade');
  });

  it('does not treat --help as a flag when it is an option value', async () => {
    const io = captureIo();

    await main(grade('--out', '--help'), io);

    expect(io.out.join('')).not.toContain('Usage: skilleval grade');
  });
});
