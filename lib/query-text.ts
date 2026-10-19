/**
 * Keeps prefilled query-string values printable and prevents markup-like
 * characters from reaching form defaults. Server-side validation remains the
 * authority when the form is submitted.
 */
export function sanitizeQueryText(
  value: string | null,
  maxLength: number,
): string {
  const cleaned = Array.from(value ?? '')
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return (
        codePoint >= 32 &&
        codePoint !== 127 &&
        character !== '<' &&
        character !== '>'
      );
    })
    .join('')
    .trim();

  return cleaned.slice(0, maxLength);
}
