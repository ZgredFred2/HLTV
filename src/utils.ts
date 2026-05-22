import * as cheerio from 'cheerio'
import { createHash, randomUUID } from 'crypto'

/** https://stackoverflow.com/a/79473259 */
function seededUUID(seed: string): string {
  const hash = createHash('sha256').update(seed).digest('hex')

  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(12, 15), // Set the version to 4
    '8' + hash.substring(15, 18), // Set the variant to 8 (RFC 4122)
    hash.substring(18, 30)
  ].join('-')
}

export const fetchPage = async (
  url: string,
  loadPage: (url: string) => Promise<string>
): Promise<cheerio.Root> => {
  const root = cheerio.load(await loadPage(url))

  const html = root.html()

  if (
    html.includes('error code:') ||
    html.includes('Sorry, you have been blocked') ||
    html.includes('Checking your browser before accessing') ||
    html.includes('Enable JavaScript and cookies to continue')
  ) {
    throw new Error(
      'Access denied | www.hltv.org used Cloudflare to restrict access'
    )
  }

  return root
}

export const generateRandomSuffix = (seed?: string | number) => {
  if (seed === undefined) return randomUUID()
  return seededUUID(String(seed))
}

export const percentageToDecimalOdd = (odd: number): number =>
  parseFloat(((1 / odd) * 100).toFixed(2))

export function getIdAt(index: number, href: string): number | undefined
export function getIdAt(index: number): (href: string) => number | undefined
export function getIdAt(index?: number, href?: string): any {
  switch (arguments.length) {
    case 1:
      return (href: string) => getIdAt(index!, href)
    default:
      return parseNumber(href!.split('/')[index!])
  }
}

export const notNull = <T>(x: T | null): x is T => x !== null

export const parseNumber = (str: string | undefined): number | undefined => {
  if (!str) {
    return undefined
  }

  const num = Number(str)

  return Number.isNaN(num) ? undefined : num
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
