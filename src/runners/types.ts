import type { EvalCase } from '../schema/evals.js';

/** Directory names follow skill-creator's workspace layout. */
export const VARIANTS = ['with_skill', 'without_skill'] as const satisfies readonly string[];

export type Variant = (typeof VARIANTS)[number];

export function isVariant(value: string): value is Variant {
  return (VARIANTS as readonly string[]).includes(value);
}

export interface RunOutput {
  readonly text: string;
  /** Where the text came from (file path, command), shown in reports. */
  readonly source: string;
}

/** Produces the agent's output for one eval under one variant. */
export interface Runner {
  run(evalCase: EvalCase, variant: Variant): Promise<RunOutput>;
}
