export function normalizeUrl(url: string): string {
  const trimmed = url.trim();

  if (!trimmed) return "";

  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
