/**
 * Example proxy setup for tests.
 * Copy to __tests__/setup.proxy.ts and customize — it's in .gitignore.
 *
 * Each dev can implement their own specific loadPage -
 * a remote proxy, or anything else that returns HTML.
 */

const SCRAPER_BASE = 'http://localhost:8000'

async function exampleLoadPage(
  url: string,
  fetchOptions?: Partial<RequestInit>
): Promise<string> {
  const post = await fetch(`${SCRAPER_BASE}/fetch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...fetchOptions?.headers },
    body: JSON.stringify({ url })
  })
  const { requestId } = await post.json()

  const poll = await fetch(`${SCRAPER_BASE}/fetch/${requestId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(120_000)
  })
  if (!poll.ok) throw new Error(`Scraper returned ${poll.status}`)

  const { html } = await poll.json()
  return html
}

export const loadPage = exampleLoadPage
