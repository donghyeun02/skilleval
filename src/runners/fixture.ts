import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { InputError, fsError, isNodeError } from '../errors.js';
import type { EvalCase } from '../schema/evals.js';
import type { RunOutput, Runner, Variant } from './types.js';

const TEXT_OUTPUT = /\.(md|txt)$/i;

export class FixtureNotFoundError extends InputError {}

async function listDir(path: string): Promise<readonly string[]> {
  try {
    return await readdir(path);
  } catch (error: unknown) {
    if (isNodeError(error, 'ENOENT')) return [];
    throw fsError('read directory', path, error);
  }
}

async function readText(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8');
  } catch (error: unknown) {
    throw fsError('read', path, error);
  }
}

/**
 * Reads outputs that already exist on disk instead of calling a model.
 *
 * Expected layout (skill-creator workspace):
 *   <root>/eval-<id>[-<name>]/<variant>/outputs/*.md|*.txt
 *
 * Several output files are joined in name order with a blank line, so line numbers
 * in evidence refer to that joined text.
 */
export class FixtureRunner implements Runner {
  readonly #root: string;

  constructor(root: string) {
    this.#root = root;
  }

  async run(evalCase: EvalCase, variant: Variant): Promise<RunOutput> {
    const evalDir = await this.#findEvalDir(evalCase.id);
    const relativeOutputs = join(evalDir, variant, 'outputs');
    const outputsDir = join(this.#root, relativeOutputs);
    const files = (await listDir(outputsDir)).filter((name) => TEXT_OUTPUT.test(name)).sort();

    if (files.length === 0) {
      throw new FixtureNotFoundError(`no .md or .txt output in ${outputsDir}`);
    }

    const texts = await Promise.all(files.map((name) => readText(join(outputsDir, name))));
    return { text: texts.join('\n\n'), source: relativeOutputs };
  }

  async #findEvalDir(id: number): Promise<string> {
    const pattern = new RegExp(`^eval-${String(id)}(?:-|$)`);
    const matches = (await listDir(this.#root)).filter((name) => pattern.test(name)).sort();
    const [match, ...others] = matches;
    if (match === undefined) {
      throw new FixtureNotFoundError(`no folder named eval-${String(id)} or eval-${String(id)}-* in ${this.#root}`);
    }
    if (others.length > 0) {
      throw new FixtureNotFoundError(`more than one folder for eval ${String(id)} in ${this.#root}: ${matches.join(', ')}`);
    }
    return match;
  }
}
