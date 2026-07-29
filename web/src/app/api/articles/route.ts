import { NextResponse } from 'next/server'
import { getArticlesBySection, readIndex } from '@/lib/articles'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  try {
    // This route has no PIN gate, so only public metadata may leave it —
    // unfiltered, it listed titles/descriptions of wiki/personal/ and
    // visibility:private articles to unauthenticated callers.
    const sections = getArticlesBySection().map(group => ({
      ...group,
      articles: group.articles.filter(a => a.visibility === 'public'),
    }))
    const index = readIndex()

    return NextResponse.json({
      sections,
      indexContent: index,
    })
  } catch (error) {
    console.error('Error listing articles:', error)
    return NextResponse.json(
      { error: 'Failed to list articles', code: 'LIST_ERROR' },
      { status: 500 }
    )
  }
}
