import { recaptchaHeaders } from './recaptcha-browser';

/** Bound UI requests so a dropped connection cannot leave a form busy forever. */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 20_000,
): Promise<Response> {
  const controller = new AbortController();
  const abort = () => controller.abort(init.signal?.reason);
  if (init.signal?.aborted) abort();
  else init.signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const protectedHeaders = await recaptchaHeaders(input, init);
    return await fetch(input, {
      ...init,
      ...(protectedHeaders ? { headers: protectedHeaders } : {}),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
    init.signal?.removeEventListener('abort', abort);
  }
}
