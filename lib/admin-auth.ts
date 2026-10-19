import 'server-only';

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import {
  canAdmin,
  isAdminRole,
  type AdminPermission,
  type AdminRole,
} from '@/lib/admin-policy';

export const ADMIN_COOKIE = 'lt_admin';
const SESSION_SECONDS = 60 * 60 * 12;

export type AdminPrincipal = {
  subject: string;
  displayName: string;
  role: AdminRole;
  sessionId: string;
  expiresAt: number;
  authSource: 'legacy-local' | 'managed';
};

export type LocalAdminCredential = Omit<
  AdminPrincipal,
  'sessionId' | 'expiresAt' | 'authSource'
>;

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function signature(payload: string) {
  return createHmac('sha256', sessionSecret())
    .update(payload)
    .digest('base64url');
}

export function adminAuthMode() {
  const configured = process.env.ADMIN_AUTH_MODE?.trim().toLowerCase();
  if (configured === 'managed') return 'managed' as const;
  if (configured === 'legacy-local') {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return 'disabled' as const;
    }
    return 'legacy-local' as const;
  }
  return 'disabled' as const;
}

function localCredentials() {
  const credentials: Array<{
    username: string;
    password: string;
    principal: LocalAdminCredential;
  }> = [];

  const superUsername =
    process.env.ADMIN_SUPER_USERNAME || process.env.ADMIN_USERNAME;
  const superPassword =
    process.env.ADMIN_SUPER_PASSWORD || process.env.ADMIN_PASSWORD;
  if (superUsername && superPassword) {
    credentials.push({
      username: superUsername,
      password: superPassword,
      principal: {
        subject: `local:${superUsername}`,
        displayName: superUsername,
        role: 'SUPER_ADMIN',
      },
    });
  }

  if (
    process.env.ADMIN_READONLY_USERNAME &&
    process.env.ADMIN_READONLY_PASSWORD
  ) {
    credentials.push({
      username: process.env.ADMIN_READONLY_USERNAME,
      password: process.env.ADMIN_READONLY_PASSWORD,
      principal: {
        subject: `local:${process.env.ADMIN_READONLY_USERNAME}`,
        displayName: process.env.ADMIN_READONLY_USERNAME,
        role: 'READ_EXPORT',
      },
    });
  }

  return credentials;
}

/**
 * The local password adapter exists only for development and preview continuity.
 * Production must use a managed identity provider; this repository intentionally
 * does not implement its own multi-user password or MFA system.
 */
export function isLegacyAdminConfigured() {
  return Boolean(
    adminAuthMode() === 'legacy-local' &&
    process.env.NODE_ENV !== 'production' &&
    !process.env.VERCEL &&
    localCredentials().length > 0 &&
    sessionSecret().length >= 32,
  );
}

export function isManagedAdminSessionReady() {
  return adminAuthMode() === 'managed' && sessionSecret().length >= 32;
}

export function isAdminConfigured() {
  return isLegacyAdminConfigured() || isManagedAdminSessionReady();
}

export function authenticateLocalAdmin(
  username: string,
  password: string,
): LocalAdminCredential | null {
  if (!isLegacyAdminConfigured()) return null;
  for (const credential of localCredentials()) {
    if (
      safeEqual(username, credential.username) &&
      safeEqual(password, credential.password)
    ) {
      return credential.principal;
    }
  }
  return null;
}

export function createAdminSession(
  principal: LocalAdminCredential,
  authSource: AdminPrincipal['authSource'] = 'legacy-local',
): string {
  if (authSource === 'legacy-local' && !isLegacyAdminConfigured()) {
    throw new Error('The local admin adapter is not configured.');
  }
  if (authSource === 'managed' && !isManagedAdminSessionReady()) {
    throw new Error('Managed administrator authentication is not configured.');
  }
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const encoded = Buffer.from(
    JSON.stringify({
      version: 2,
      subject: principal.subject,
      displayName: principal.displayName,
      role: principal.role,
      sessionId: randomUUID(),
      expiresAt,
      authSource,
    }),
  ).toString('base64url');
  return `${encoded}.${signature(encoded)}`;
}

export function readAdminSession(
  token: string | undefined,
): AdminPrincipal | null {
  if (!token || sessionSecret().length < 32) return null;
  const segments = token.split('.');
  if (segments.length !== 2) return null;
  const [encoded, receivedSignature] = segments;
  if (!encoded || !receivedSignature) return null;
  if (!safeEqual(receivedSignature, signature(encoded))) return null;

  try {
    const payload = Buffer.from(encoded, 'base64url').toString('utf8');
    const parsed = JSON.parse(payload) as Record<string, unknown>;
    if (
      parsed.version !== 2 ||
      typeof parsed.subject !== 'string' ||
      typeof parsed.displayName !== 'string' ||
      !isAdminRole(parsed.role) ||
      typeof parsed.sessionId !== 'string' ||
      typeof parsed.expiresAt !== 'number' ||
      !Number.isFinite(parsed.expiresAt) ||
      parsed.expiresAt <= Math.floor(Date.now() / 1000) ||
      (parsed.authSource !== 'legacy-local' && parsed.authSource !== 'managed')
    ) {
      return null;
    }
    if (
      parsed.authSource === 'legacy-local' &&
      adminAuthMode() !== 'legacy-local'
    ) {
      return null;
    }
    if (parsed.authSource === 'managed' && adminAuthMode() !== 'managed') {
      return null;
    }
    if (parsed.authSource === 'legacy-local' && !isLegacyAdminConfigured()) {
      return null;
    }
    if (parsed.authSource === 'managed' && !isManagedAdminSessionReady()) {
      return null;
    }

    return {
      subject: parsed.subject,
      displayName: parsed.displayName,
      role: parsed.role,
      sessionId: parsed.sessionId,
      expiresAt: parsed.expiresAt,
      authSource: parsed.authSource,
    };
  } catch {
    return null;
  }
}

export function verifyAdminSession(token: string | undefined) {
  return readAdminSession(token) !== null;
}

export function authorizeAdmin(
  token: string | undefined,
  permission: AdminPermission,
) {
  const principal = readAdminSession(token);
  return principal && canAdmin(principal.role, permission) ? principal : null;
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_SECONDS,
  priority: 'high' as const,
};
