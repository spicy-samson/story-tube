import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const config = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
const thumbnailRoute = await readFile(
  new URL('../server/api/youtube/thumbnail.get.ts', import.meta.url),
  'utf8'
)

test('keeps release response headers and the YouTube timeout enabled', () => {
  assert.match(config, /X-Content-Type-Options.*nosniff/)
  assert.match(config, /X-Frame-Options.*DENY/)
  assert.match(thumbnailRoute, /AbortSignal\.timeout\(5_000\)/)
  assert.match(thumbnailRoute, /fetch\([^\n]+\{ signal \}\)/)
})
