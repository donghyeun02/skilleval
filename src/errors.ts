/**
 * Errors the user can fix by changing their input (files, flags).
 * The CLI maps every InputError to exit code 2 so that exit 1 always means "regression".
 */
export class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Wraps a filesystem failure into an InputError that names the path and what we were doing. */
export function fsError(action: string, path: string, error: unknown): InputError {
  const code = error instanceof Error && 'code' in error ? String(error.code) : 'unknown error';
  return new InputError(`cannot ${action} ${path} (${code})`);
}

export function isNodeError(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}

export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
