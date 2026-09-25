/**
 * Pure helper functions for time, numbers, and strings
 */

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatClockTime(timestampMs: number): string {
  return new Date(timestampMs).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 32-character Crockford Base32 alphabet (no padding required, zero modulo bias: 256 % 32 === 0)
const ID_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';

export function generateId(prefix: string = 'id', length?: number): string {
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : null;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Cryptographically secure PRNG (crypto.getRandomValues) is not available');
  }

  // Use 10-character code for room IDs; default other IDs to 10 characters
  const codeLength = length ?? (prefix === 'room' ? 10 : 10);
  const randomBytes = new Uint8Array(codeLength);
  cryptoObj.getRandomValues(randomBytes);

  let code = '';
  for (let i = 0; i < codeLength; i++) {
    code += ID_ALPHABET[randomBytes[i] % 32];
  }

  return `${prefix}-${code}`;
}
