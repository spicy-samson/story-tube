import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const chromaticSource = await readFile(
  new URL('../components/story/templates/ChromaticStoryCard.vue', import.meta.url),
  'utf8'
)

test('uses the thumbnail as a soft-focus full-canvas color wash', () => {
  const thumbnailReferences = chromaticSource.match(/metadata\.thumbnailUrl/g) ?? []

  assert.ok(thumbnailReferences.length >= 2)
  assert.match(chromaticSource, /absolute -inset-6/)
  assert.match(chromaticSource, /blur-\[24px\]/)
  assert.match(chromaticSource, /scale-110/)
  assert.match(chromaticSource, /bg-\[var\(--story-bg\)\] opacity-55/)
})

test('uses a restrained Gallery composition', () => {
  assert.match(chromaticSource, /data-chromatic-artwork/)
  assert.match(chromaticSource, /border-white\/60/)
  assert.match(chromaticSource, />Chromatic study</)
  assert.match(chromaticSource, /\[overflow-wrap:anywhere\]/)
  assert.doesNotMatch(chromaticSource, /line-clamp-[0-9]/)
  assert.doesNotMatch(chromaticSource, /rotate-/)
  assert.doesNotMatch(chromaticSource, /-right-28|-bottom-24/)
})
