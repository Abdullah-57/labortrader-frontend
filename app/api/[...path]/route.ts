/**
 * Catch-all mock API for frontend experimentation.
 * Forms expect `{ ok: true }` on success; mutations never hit a real backend.
 */

function mockJson(extra: Record<string, unknown> = {}) {
  return Response.json({
    ok: true,
    mock: true,
    message: 'Mock API — frontend experiment mode. Nothing was persisted.',
    ...extra,
  });
}

export async function GET() {
  return mockJson({ signup: null, session: null, data: [] });
}

export async function POST() {
  return mockJson();
}

export async function PUT() {
  return mockJson();
}

export async function PATCH() {
  return mockJson();
}

export async function DELETE() {
  return mockJson();
}
