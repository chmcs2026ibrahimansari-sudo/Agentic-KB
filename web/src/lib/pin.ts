import crypto from 'crypto'

/**
 * Constant-time PIN comparison. A plain !== short-circuits on the first
 * differing character, which leaks prefix length to a network attacker who
 * can measure response timing on the PIN-gated API routes. Hash both sides
 * to fixed length so timingSafeEqual accepts unequal-length inputs.
 */
export function pinMatches(provided: string, expected: string): boolean {
  if (!expected) return false
  const a = crypto.createHash('sha256').update(String(provided), 'utf8').digest()
  const b = crypto.createHash('sha256').update(String(expected), 'utf8').digest()
  return crypto.timingSafeEqual(a, b)
}
