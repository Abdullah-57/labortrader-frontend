export type ClientAttribution = Record<string, string>;

export function readAttribution(): ClientAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem('lt_attribution');
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    );
  } catch {
    return {};
  }
}

export function writeAttribution(value: ClientAttribution) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem('lt_attribution', JSON.stringify(value));
  } catch {
    // Marketing attribution is best effort and must not block the product.
  }
}
