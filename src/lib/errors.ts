// This helper is intended for places where the error type is unknown.

export function getErrMessage(err: unknown, fallback: string): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    const d = obj.detail;
    const m = obj.message;
    if (typeof d === "string") return d;
    if (typeof m === "string") return m;
  }
  return fallback;
}
