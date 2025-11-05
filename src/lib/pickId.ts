export type IdLike = {
  id?: string | number;
  memberId?: string | number;
  email?: string;
};

export function pickIdPart(input: unknown): string {
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const id = obj.id ?? obj.memberId ?? obj.email;
    if (typeof id === "string" || typeof id === "number") {
      return String(id);
    }
  }
  return "target";
}
