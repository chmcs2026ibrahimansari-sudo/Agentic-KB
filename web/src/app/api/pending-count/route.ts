import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { DEFAULT_KB_ROOT } from '@/lib/articles'

export const dynamic = 'force-dynamic'

const KB_ROOT = DEFAULT_KB_ROOT

function getIngestedPaths(): Set<string> {
  const logPath = path.join(KB_ROOT, 'wiki', 'log.md')
  const ingested = new Set<string>()
  try {
    const log = fs.readFileSync(logPath, 'utf8')
    for (const line of log.split('\n')) {
      if (!line.includes('INGEST')) continue
      const matches = line.match(/raw\/[^\s|,]+\.md/g)
      if (matches) matches.forEach(m => ingested.add(m))
      const slugMatch = line.match(/INGEST \| ([^|]+) \|/)
      if (slugMatch) ingested.add(slugMatch[1].trim())
    }
  } catch { /* no log yet */ }
  return ingested
}

export async function GET(): Promise<NextResponse> {
  const rawRoot = path.join(KB_ROOT, 'raw')
  const ingestedPaths = getIngestedPaths()
  // Materialize the set once — the substring fallback below re-built this
  // array for every raw/ file, an O(files x log-entries) allocation on each
  // poll of this route (TopBar hits it on every page load).
  const ingestedList = Array.from(ingestedPaths)
  let count = 0

  function walk(dir: string): void {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (['my-agents', 'my-skills', 'my-hooks'].includes(entry.name)) continue
        walk(fullPath)
      } else if (entry.name.endsWith('.md') && entry.name !== 'Untitled.md') {
        const relPath = path.relative(KB_ROOT, fullPath).replace(/\\/g, '/')
        const alreadyIngested = ingestedPaths.has(relPath) ||
          ingestedList.some(p =>
            relPath.includes(p) || p.includes(path.basename(relPath, '.md'))
          )
        if (!alreadyIngested) count++
      }
    }
  }

  walk(rawRoot)
  return NextResponse.json({ count })
}
