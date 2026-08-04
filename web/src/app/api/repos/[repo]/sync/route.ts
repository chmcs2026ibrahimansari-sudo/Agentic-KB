import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_KB_ROOT } from '@/lib/articles'
import { getRepo, syncRepo } from '../../../../../../../lib/repo-runtime/index.mjs'

export const dynamic = 'force-dynamic'

// GET: Return sync status
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ repo: string }> }
): Promise<NextResponse> {
  const { repo } = await params
  const record = getRepo(DEFAULT_KB_ROOT, repo)

  if (!record) {
    return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
  }

  return NextResponse.json({
    repo,
    status: record.status || 'new',
    last_sync_at: record.last_sync_at || null,
    last_synced_commit: record.last_synced_commit || null,
    markdown_file_count: record.markdown_file_count || 0,
  })
}

// POST: Trigger sync for a repo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ repo: string }> }
): Promise<NextResponse> {
  const { repo } = await params
  const record = getRepo(DEFAULT_KB_ROOT, repo)

  if (!record) {
    return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { token } = body

    const opts: Record<string, unknown> = {}
    // syncRepo reads opts.token (see lib/repo-runtime/sync.mjs) — the previous
    // opts.githubToken key was silently ignored, so a token supplied through
    // this route never reached the GitHub API. Fall back to env GITHUB_PAT,
    // matching the MCP sync_repo_markdown handler.
    const effectiveToken = token || process.env.GITHUB_PAT
    if (effectiveToken) opts.token = effectiveToken

    // Trigger sync - syncRepo takes the record object
    const trace = await syncRepo(DEFAULT_KB_ROOT, record, opts)

    // syncRepo reports fetch failures via trace.errors instead of throwing.
    // Don't mark the repo synced on a failed fetch — that stamped
    // last_sync_at and overwrote last_synced_commit with '' even though
    // nothing was fetched.
    const fetchFailed = Array.isArray(trace.errors) && trace.errors.some(
      (e: { type?: string }) => e.type === 'fetch'
    )
    if (fetchFailed) {
      return NextResponse.json({ synced: false, repo, trace }, { status: 502 })
    }

    // Registry sync state (last_sync_at, commit, file count) is recorded by
    // syncRepo itself so CLI/MCP/web all stay consistent.
    return NextResponse.json({
      synced: true,
      repo,
      trace,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    )
  }
}
