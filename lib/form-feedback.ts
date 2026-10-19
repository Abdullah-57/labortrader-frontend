/**
 * Shared client-side form feedback: scroll to the first field that needs fixing
 * so required-field errors are visible and explained. Focus uses preventScroll
 * so it does not jump the viewport to the top.
 */
export function focusFirstFormError(input: {
  summary?: HTMLElement | null;
  errors: Record<string, string[]>;
  /** Map field names to DOM ids when they differ (e.g. termsAccepted → checkbox id). */
  fieldIds?: Record<string, string>;
  /** Optional prefix for ids like `partner-email`. */
  idPrefix?: string;
}) {
  const firstField = Object.keys(input.errors)[0];
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (!firstField) {
        input.summary?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        input.summary?.focus({ preventScroll: true });
        return;
      }
      const mapped = input.fieldIds?.[firstField];
      const prefixed = input.idPrefix
        ? `${input.idPrefix}-${firstField}`
        : undefined;
      const target =
        (mapped ? document.getElementById(mapped) : null) ||
        (prefixed ? document.getElementById(prefixed) : null) ||
        document.getElementById(firstField) ||
        document.querySelector<HTMLElement>(
          `[name="${CSS.escape(firstField)}"]`,
        );
      if (target) {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        const focusable = target.matches(
          'button,input,select,textarea,[tabindex]',
        )
          ? target
          : target.querySelector<HTMLElement>(
              'button,input,select,textarea,[tabindex]',
            );
        focusable?.focus({ preventScroll: true });
        return;
      }
      input.summary?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      input.summary?.focus({ preventScroll: true });
    });
  });
}
