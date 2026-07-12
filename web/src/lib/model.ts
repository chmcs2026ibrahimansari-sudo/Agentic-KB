/**
 * Single knob for which Claude model the KB's API routes use.
 * Override with KB_MODEL (e.g. KB_MODEL=claude-sonnet-5) — no code change needed.
 */
export const KB_MODEL = process.env.KB_MODEL || 'claude-sonnet-4-6'
