import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InputError } from '../src/errors.js';
import { FixtureNotFoundError, FixtureRunner } from '../src/runners/fixture.js';
import type { EvalCase } from '../src/schema/evals.js';

const evalCase = (id: number): EvalCase => ({
  id,
  prompt: 'p',
  expectedOutput: 'e',
  files: [],
  expectations: [],
  assertions: [],
});

function writeOutput(root: string, dir: string, variant: string, file: string, text: string): void {
  const outputs = join(root, dir, variant, 'outputs');
  mkdirSync(outputs, { recursive: true });
  writeFileSync(join(outputs, file), text);
}

describe('FixtureRunner', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'skilleval-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('reads skill-creator style outputs by eval id prefix', async () => {
    writeOutput(root, 'eval-0-match3', 'with_skill', 'result.md', 'WITH');
    writeOutput(root, 'eval-0-match3', 'without_skill', 'result.md', 'WITHOUT');

    const runner = new FixtureRunner(root);

    await expect(runner.run(evalCase(0), 'with_skill')).resolves.toMatchObject({ text: 'WITH' });
    await expect(runner.run(evalCase(0), 'without_skill')).resolves.toMatchObject({ text: 'WITHOUT' });
  });

  it('does not confuse eval-1 with eval-10', async () => {
    writeOutput(root, 'eval-10-other', 'with_skill', 'result.md', 'TEN');
    writeOutput(root, 'eval-1', 'with_skill', 'result.md', 'ONE');

    const output = await new FixtureRunner(root).run(evalCase(1), 'with_skill');

    expect(output.text).toBe('ONE');
  });

  it('joins multiple text outputs in name order and ignores other files', async () => {
    writeOutput(root, 'eval-2', 'with_skill', 'b.md', 'B');
    writeOutput(root, 'eval-2', 'with_skill', 'a.txt', 'A');
    writeOutput(root, 'eval-2', 'with_skill', 'chart.png', 'binary');

    const output = await new FixtureRunner(root).run(evalCase(2), 'with_skill');

    expect(output.text).toBe('A\n\nB');
  });

  it('throws FixtureNotFoundError with the expected location when missing', async () => {
    const runner = new FixtureRunner(root);

    await expect(runner.run(evalCase(7), 'with_skill')).rejects.toThrow(FixtureNotFoundError);
    await expect(runner.run(evalCase(7), 'with_skill')).rejects.toThrow(/eval-7/);
  });

  it('reports the source relative to the fixtures root so committed baselines do not churn', async () => {
    writeOutput(root, 'eval-4-x', 'with_skill', 'result.md', 'T');

    const output = await new FixtureRunner(root).run(evalCase(4), 'with_skill');

    expect(output.source).toBe(join('eval-4-x', 'with_skill', 'outputs'));
  });

  it('refuses to guess when two folders match the same id', async () => {
    writeOutput(root, 'eval-5-a', 'with_skill', 'result.md', 'A');
    writeOutput(root, 'eval-5-b', 'with_skill', 'result.md', 'B');

    await expect(new FixtureRunner(root).run(evalCase(5), 'with_skill')).rejects.toThrow(/more than one folder/);
  });

  it('turns filesystem errors into input errors that name the path', async () => {
    const file = join(root, 'not-a-dir');
    writeFileSync(file, 'x');

    await expect(new FixtureRunner(file).run(evalCase(0), 'with_skill')).rejects.toThrow(InputError);
    await expect(new FixtureRunner(file).run(evalCase(0), 'with_skill')).rejects.toThrow(/ENOTDIR/);
  });

  it('throws when the variant folder has no text outputs', async () => {
    writeOutput(root, 'eval-3', 'with_skill', 'chart.png', 'binary');

    await expect(new FixtureRunner(root).run(evalCase(3), 'with_skill')).rejects.toThrow(/no \.md or \.txt/);
  });
});
