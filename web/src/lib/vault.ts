import fs from 'fs'
import os from 'os'
import path from 'path'
import { DEFAULT_KB_ROOT } from './articles'

export const VAULT_COOKIE = 'active_vault_path'

interface ObsidianVault {
  path: string
}

/**
 * Vault roots the server is willing to serve content from: the default KB
 * root plus every vault registered in the local Obsidian config.
 *
 * The active-vault cookie is client-controlled, so its value must never be
 * used as a raw filesystem root — before this allowlist existed, any caller
 * could set `active_vault_path=/` (no PIN required) and read or write under
 * arbitrary directories via /api/search, /api/query/save, /wiki, etc.
 */
// The allowlist is derived from a file on disk, and resolveVaultRoot runs on
// essentially every API request (18 call sites) — recomputing meant a
// synchronous readFileSync + JSON.parse of the Obsidian config per request,
// on the request path, for a file that changes when the user adds a vault.
// Cached against the config's mtime, the same invalidation rbac.ts and
// graph-search.ts already use. A missing config is cached too (mtime -1), so
// the common "no Obsidian installed" case stops stat-ing on every call.
let _cache: { paths: string[]; mtimeMs: number } | null = null

function configMtime(configPath: string): number {
  try { return fs.statSync(configPath).mtimeMs } catch { return -1 }
}

export function allowedVaultPaths(): string[] {
  const configPath = path.join(os.homedir(), 'Library/Application Support/obsidian/obsidian.json')
  const mtimeMs = configMtime(configPath)
  if (_cache && _cache.mtimeMs === mtimeMs) return _cache.paths

  const paths = [path.resolve(DEFAULT_KB_ROOT)]
  try {
    const raw = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(raw) as { vaults?: Record<string, ObsidianVault> }
    for (const vault of Object.values(config.vaults || {})) {
      if (vault?.path) paths.push(path.resolve(vault.path))
    }
  } catch {
    /* no Obsidian config — default vault only */
  }
  _cache = { paths, mtimeMs }
  return paths
}

/** Drop the cached allowlist. Exported for tests. */
export function invalidateVaultAllowlist(): void {
  _cache = null
}

export function isAllowedVault(vaultPath: string): boolean {
  return allowedVaultPaths().includes(path.resolve(vaultPath))
}

/**
 * Resolve the active vault root from the (untrusted) cookie value.
 * Unknown or unregistered paths fall back to the default vault.
 * Returns DEFAULT_KB_ROOT verbatim for the default vault so existing
 * `vaultRoot === DEFAULT_KB_ROOT` checks keep working.
 */
export function resolveVaultRoot(cookieValue: string | undefined | null): string {
  if (!cookieValue) return DEFAULT_KB_ROOT
  const resolved = path.resolve(cookieValue)
  if (resolved === path.resolve(DEFAULT_KB_ROOT)) return DEFAULT_KB_ROOT
  return isAllowedVault(resolved) ? resolved : DEFAULT_KB_ROOT
}
