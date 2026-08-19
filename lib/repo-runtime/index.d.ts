// Ambient type declarations for the shared repo runtime.
// All runtime methods are typed loosely as `any` for now.
//
// Nothing checks these against the .mjs sources, so they drift silently and a
// TS caller that trusts them calls the runtime wrong (markSynced took an
// options object, not a sha string; transitionRepoBusItem's actor parameter
// was missing entirely). Update this file in the same commit as any exported
// signature change.

export function loadRegistry(kbRoot: string): any
export function saveRegistry(kbRoot: string, records: any[]): void
export function getRepo(kbRoot: string, name: string): any | null
export function upsertRepo(kbRoot: string, record: any): any
export function listRepos(kbRoot: string): any[]
export function markSynced(kbRoot: string, name: string, state: { commit_sha?: string; file_count?: number }): any

export function repoWikiRoot(repo: string): string
export function repoDocsRoot(repo: string): string
export function repoCanonicalRoot(repo: string): string
export function repoAgentMemoryRoot(repo: string, tier: string, agentId: string): string
export function repoBusRoot(repo: string, channel: string): string
export function repoTasksRoot(repo: string): string
export function repoRewritesRoot(repo: string, type: string): string
export function importedDocPath(repo: string, sourceRelPath: string): string
export function isImportedDoc(relPath: string): boolean
export function isOperationalDoc(relPath: string): boolean
export function assertNotImportedDoc(relPath: string): void

export function makeImportedFrontmatter(opts: any): Record<string, any>
export function parseImportedMeta(content: string): any
export function isImportedContent(content: string): boolean

export function syncRepo(kbRoot: string, name: string, opts?: any): Promise<any>

export function closeRepoTask(kbRoot: string, repo: string, contract: any, payload: any): any
export function dryRunCloseRepoTask(kbRoot: string, repo: string, contract: any, payload: any): any
export function validateRepoCloseTaskPayload(contract: any, payload: any): any
export function appendRepoProgress(kbRoot: string, repo: string, entry: string, agentId?: string): string
export function writeRepoTaskLog(kbRoot: string, repo: string, taskId: string, agentId: string, entry: string): string

export function publishRepoBusItem(kbRoot: string, repo: string, opts: any): { id: string; path: string }
export function readRepoBusItem(kbRoot: string, repo: string, channel: string, id: string): any
export function listRepoBusItems(kbRoot: string, repo: string, channel: string, opts?: any): any[]
export function transitionRepoBusItem(kbRoot: string, repo: string, channel: string, id: string, newStatus: string, actor?: string, extraMeta?: Record<string, any>): { path: string; status: string }

export function loadRepoContext(kbRoot: string, repo: string, contractOrOpts?: any, vars?: any): { files: any[]; trace: any }

export function resolveRepoWikiDir(kbRoot: string, repo: string): string | null
export function loadRepoMetadata(kbRoot: string, repo: string): any | null
export function listRepoDocs(kbRoot: string, repo: string, section?: string | null): Array<{ path: string; bytes: number }>
export function searchRepoDocs(
  kbRoot: string,
  repo: string,
  query: string,
  opts?: { limit?: number }
): Array<{ path: string; snippet: string; score: number }>
export function listRepoRewrites(kbRoot: string, repo: string): Array<{ path: string; type: string; project: string; status: string; title: string }>
export function listRepoCanonical(kbRoot: string, repo: string): Array<{ name: string; title: string; doc_type: string; status: string }>
export function readRepoCanonical(kbRoot: string, repo: string, doc: string): string | null

export function generateCanonicalTemplate(docType: string, repo: string, vars?: any): string
export function generateHomePage(repoRecord: any): string
export function generateProgressPage(repo: string): string
export function generateRepoCLAUDE(repo: string, vars?: any): string
