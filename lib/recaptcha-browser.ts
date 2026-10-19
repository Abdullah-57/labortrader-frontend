import { recaptchaActionForPath } from './recaptcha-actions';

type Recaptcha = {
  ready(callback: () => void): void;
  execute(key: string, options: { action: string }): Promise<string>;
};
declare global {
  interface Window {
    grecaptcha?: Recaptcha;
  }
}
let loading: Promise<Recaptcha> | null = null;

function loadRecaptcha(key: string): Promise<Recaptcha> {
  if (loading) return loading;
  loading = new Promise<Recaptcha>((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      script.remove();
      reject(new Error('Verification timed out. Please try again.'));
    }, 10_000);
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    script.onerror = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('Verification could not load. Please try again.'));
    };
    script.onload = () => {
      if (!window.grecaptcha) {
        clearTimeout(timeout);
        script.remove();
        reject(new Error('Verification unavailable.'));
        return;
      }
      window.grecaptcha.ready(() => {
        clearTimeout(timeout);
        resolve(window.grecaptcha!);
      });
    };
    document.head.appendChild(script);
  }).catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}

/** Mint a fresh action-bound token only when submitting, never on page load. */
export async function recaptchaHeaders(
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<Headers | undefined> {
  if (typeof window === 'undefined' || init.method?.toUpperCase() !== 'POST')
    return;
  const url = new URL(
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url,
    window.location.origin,
  );
  if (url.origin !== window.location.origin) return;
  const action = recaptchaActionForPath(url.pathname);
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!action || !key) return;
  const captcha = await loadRecaptcha(key);
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const token = await Promise.race([
      captcha.execute(key, { action }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error('Verification timed out. Please try again.')),
          10_000,
        );
      }),
    ]);
    if (!token) throw new Error('Verification unavailable.');
    const headers = new Headers(init.headers);
    headers.set('X-Recaptcha-Token', token);
    return headers;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
