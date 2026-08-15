/**
 * Wiki link parsing utilities.
 * Handles [[path]], [[path|Label]], [[wiki/path]], etc.
 */

export interface WikiLink {
  raw: string       // the full [[...]] match
  path: string      // the resolved path (without wiki/ prefix)
  label: string     // the display label
  href: string      // the Next.js href (/wiki/...)
}

/**
 * Parse a single wiki link string like "concepts/foo" or "concepts/foo|Label"
 */
export function parseWikiLinkTarget(target: string): { path: string; label: string; href: string } {
  const pipeIdx = target.indexOf('|')
  let rawPath: string
  let label: string

  if (pipeIdx !== -1) {
    rawPath = target.slice(0, pipeIdx).trim()
    label = target.slice(pipeIdx + 1).trim()
  } else {
    rawPath = target.trim()
    label = rawPath.split('/').pop()?.replace(/-/g, ' ') || rawPath
    // Capitalize first letter
    label = label.charAt(0).toUpperCase() + label.slice(1)
  }

  // Split off a #section anchor before path cleanup. Left in the path,
  // [[page#Some Section]] produced hrefs like "/wiki/page#Some Section" —
  // a destination with a raw space, which markdown does not even parse as
  // a link — and `path` no longer matched any article for backlinks.
  let anchor = ''
  const hashIdx = rawPath.indexOf('#')
  if (hashIdx !== -1) {
    anchor = rawPath.slice(hashIdx + 1).trim()
    rawPath = rawPath.slice(0, hashIdx).trim()
  }

  // Strip leading "wiki/" if present
  const cleanPath = rawPath.replace(/^wiki\//, '').replace(/\.md$/, '')

  // Slugify the anchor the same way extractHeadings generates heading ids,
  // so the fragment actually lands on the rendered heading.
  const fragment = anchor
    ? '#' + anchor.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
    : ''

  return {
    path: cleanPath,
    label,
    // [[#Local Section]] links within the same page keep a bare fragment
    href: cleanPath ? `/wiki/${cleanPath}${fragment}` : fragment || '/wiki/',
  }
}

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g

/** Rewrite every [[link]] on one line of prose, leaving inline code spans
 *  alone. A `` `[[a|b]]` `` in running text is documentation of the syntax,
 *  not a link. Backtick runs are matched longest-first so ``` ``a `b` `` ```
 *  style spans are handled the way CommonMark handles them. */
function replaceOutsideCodeSpans(line: string): string {
  let out = ''
  let i = 0
  while (i < line.length) {
    const tickStart = line.indexOf('`', i)
    if (tickStart === -1) {
      out += line.slice(i).replace(WIKILINK_RE, replaceOne)
      break
    }
    out += line.slice(i, tickStart).replace(WIKILINK_RE, replaceOne)
    // Measure the opening run, then find a closing run of the same length.
    let runEnd = tickStart
    while (runEnd < line.length && line[runEnd] === '`') runEnd++
    const run = line.slice(tickStart, runEnd)
    const close = line.indexOf(run, runEnd)
    if (close === -1) {
      // Unterminated span — not a code span at all; treat the rest as prose.
      out += run + line.slice(runEnd).replace(WIKILINK_RE, replaceOne)
      break
    }
    out += line.slice(tickStart, close + run.length)
    i = close + run.length
  }
  return out
}

function replaceOne(_match: string, inner: string): string {
  const { label, href } = parseWikiLinkTarget(inner)
  return `[${label}](${href})`
}

/**
 * Replace all [[wiki-links]] in markdown content with markdown links.
 * This is used in the ArticleRenderer for client-side rendering.
 *
 * Fenced code blocks and inline code spans are left verbatim. The wiki
 * documents its own link syntax — prompt templates, decision-record
 * skeletons and slash-command specs all show literal `[[path/to/page]]`
 * inside ``` blocks for the reader to copy out. Rewriting those to
 * `[Page](/wiki/path/to/page)` corrupted the very text the block exists to
 * display, and a copied template no longer round-trips. Same protected-region
 * rule autolink.py applies to its substitutions and extractHeadings applies
 * to its fence scan.
 */
export function replaceWikiLinks(content: string): string {
  const lines = content.split('\n')
  let inFence = false
  let fenceMarker = ''

  return lines.map(line => {
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (fence) {
      if (!inFence) {
        inFence = true
        fenceMarker = fence[1][0]
      } else if (fence[1][0] === fenceMarker) {
        inFence = false
      }
      return line
    }
    if (inFence) return line
    return replaceOutsideCodeSpans(line)
  }).join('\n')
}

/**
 * Extract all wiki links from a markdown document.
 */
export function extractWikiLinks(content: string): WikiLink[] {
  const links: WikiLink[] = []
  const pattern = /\[\[([^\]]+)\]\]/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    const { path, label, href } = parseWikiLinkTarget(match[1])
    links.push({
      raw: match[0],
      path,
      label,
      href,
    })
  }

  return links
}

/**
 * Build a regex that can find references to a given slug in markdown text.
 */
export function buildSlugPattern(slug: string): RegExp {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\[\\[(?:wiki/)?${escaped}(?:\\|[^\\]]+)?\\]\\]`, 'gi')
}

/**
 * Generate a URL-safe slug from a title.
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extract headings from markdown for ToC generation.
 */
export interface Heading {
  level: number
  text: string
  id: string
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const lines = content.split('\n')
  let inFence = false
  let fenceMarker = ''

  for (const line of lines) {
    // Skip fenced code blocks: a `# comment` inside ``` / ~~~ is not a
    // heading — it produced ToC entries pointing at anchors that don't
    // exist in the rendered article (remark only ids real headings).
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (fence) {
      if (!inFence) {
        inFence = true
        fenceMarker = fence[1][0]
      } else if (fence[1][0] === fenceMarker) {
        inFence = false
      }
      continue
    }
    if (inFence) continue
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      // Generate an ID matching what remark/rehype would generate
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
      headings.push({ level, text, id })
    }
  }

  return headings
}
