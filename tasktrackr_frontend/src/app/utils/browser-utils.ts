/**
 * Utilities for safe access to browser-only globals.
 * Avoids SSR and linter errors by checking environment.
 */

/**
 * PUBLIC_INTERFACE
 * Returns true if the current runtime is a browser (window is available).
 */
export function isBrowser(): boolean {
  // Use globalThis to avoid direct reference to window/document
  return typeof globalThis !== 'undefined' && typeof (globalThis as any).document !== 'undefined';
}

/**
 * PUBLIC_INTERFACE
 * Returns a reference to localStorage if available, otherwise null.
 */
export function getLocalStorage(): any | null {
  if (!isBrowser()) return null;
  const w = globalThis as any;
  return w && w.localStorage ? (w.localStorage as any) : null;
}

/**
 * PUBLIC_INTERFACE
 * Returns a UUID string using the best available method in the current environment.
 */
export function safeUuid(): string {
  const g = globalThis as any;
  if (isBrowser() && g && g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  // Fallback: very simple UUID v4-like generator
  // Not cryptographically strong, but sufficient for client-only ids.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
