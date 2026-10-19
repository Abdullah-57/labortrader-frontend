/**
 * Canonical email identity for duplicate / verification matching.
 * Strips +tag aliases (user+otp@domain → user@domain) after lowercasing.
 * Does not remove Gmail dots (would invalidate existing fingerprints).
 */
export function canonicalizeEmailIdentity(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at < 1 || at === trimmed.length - 1) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const plus = local.indexOf('+');
  const bareLocal = plus >= 0 ? local.slice(0, plus) : local;
  return `${bareLocal}@${domain}`;
}

export function emailsShareIdentity(a: string, b: string): boolean {
  return canonicalizeEmailIdentity(a) === canonicalizeEmailIdentity(b);
}
