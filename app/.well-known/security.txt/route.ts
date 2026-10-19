const origin = 'https://labortraders.com';

export function GET() {
  const body = [
    'Contact: mailto:support@labortraders.com',
    `Canonical: ${new URL('/.well-known/security.txt', origin)}`,
    `Policy: ${new URL('/privacy', origin)}`,
    'Preferred-Languages: en',
    'Expires: 2027-09-29T00:00:00.000Z',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
