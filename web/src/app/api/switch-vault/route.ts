import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { VAULT_COOKIE, isAllowedVault, resolveVaultRoot } from '@/lib/vault'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // A body-less or malformed POST throws in request.json(). Unhandled, that
  // surfaces as an opaque 500 with a stack rather than the 400 the UI knows
  // how to render — same guard the compile/lint/process routes already apply.
  let vaultPath: string | undefined
  try {
    const body = await request.json() as { vaultPath?: string }
    vaultPath = typeof body?.vaultPath === 'string' ? body.vaultPath : undefined
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body with a vaultPath.' }, { status: 400 })
  }

  // Only vaults registered in the Obsidian config (or the default KB root)
  // may be activated — the cookie is client-controlled, so consumers validate
  // it again via resolveVaultRoot, but rejecting here gives the UI a clear error.
  if (!vaultPath || !isAllowedVault(vaultPath) || !fs.existsSync(vaultPath)) {
    return NextResponse.json({ error: 'Vault path not found' }, { status: 400 })
  }

  const name = path.basename(vaultPath)
  const response = NextResponse.json({ ok: true, name, path: vaultPath })
  response.cookies.set(VAULT_COOKIE, vaultPath, {
    path: '/',
    httpOnly: false,     // readable client-side for TopBar
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
  return response
}

export async function GET(request: NextRequest) {
  const vaultPath = resolveVaultRoot(request.cookies.get(VAULT_COOKIE)?.value)
  const name = path.basename(vaultPath)
  return NextResponse.json({ name, path: vaultPath })
}

