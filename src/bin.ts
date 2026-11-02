#!/usr/bin/env node
import process from 'node:process';
import { EXIT, main } from './cli.js';

try {
  process.exitCode = await main(process.argv.slice(2), {
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  });
} catch (error: unknown) {
  // Never let a crash exit 1: in CI that would read as "the skill regressed".
  const detail = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`skilleval: internal error\n${detail}\n`);
  process.exitCode = EXIT.internal;
}
