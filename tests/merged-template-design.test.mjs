import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const headlineSource = await readFile(
  new URL('../components/story/templates/HeadlineStoryCard.vue', import.meta.url),
  'utf8'
)
const frameSource = await readFile(
  new URL('../components/story/templates/FrameStoryCard.vue', import.meta.url),
  'utf8'
)

test('merges Headline and Bulletin into a black glass upload story', () => {
  assert.match(headlineSource, /backdrop-blur-xl/)
  assert.match(headlineSource, /bg-black\/60/)
  assert.match(headlineSource, />New upload</)
  assert.match(headlineSource, />Watch on YouTube</)
  assert.match(headlineSource, /\[overflow-wrap:anywhere\]/)
})

test('merges Frame and Caption into a white asymmetric editorial story', () => {
  assert.match(frameSource, /bg-\[#f7f7f3\]/)
  assert.match(frameSource, /grid-cols-\[4px_minmax\(0,1fr\)\]/)
  assert.match(frameSource, /shadow-\[8px_8px_0_var\(--story-accent\)\]/)
  assert.match(frameSource, /StoryYoutubeBrand tone="dark"/)
  assert.match(frameSource, /\[overflow-wrap:anywhere\]/)
})
