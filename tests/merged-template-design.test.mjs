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

test('keeps Headline stable with a fitted title region', () => {
  assert.match(headlineSource, /backdrop-blur-xl/)
  assert.match(headlineSource, /bg-black\/60/)
  assert.match(headlineSource, /h-36/)
  assert.match(headlineSource, /headlineTitleClass/)
  assert.match(headlineSource, /title\.value\.length/)
  assert.match(headlineSource, /\[overflow-wrap:anywhere\]/)
  assert.doesNotMatch(headlineSource, /New release|New upload|Watch on YouTube/)
})

test('keeps Frame quiet with one subtle artwork border', () => {
  assert.match(frameSource, /bg-\[#f7f7f3\]/)
  assert.match(frameSource, /data-frame-artwork/)
  assert.match(frameSource, /border-black\/15/)
  assert.match(frameSource, /StoryYoutubeBrand tone="dark"/)
  assert.match(frameSource, /\[overflow-wrap:anywhere\]/)
  assert.doesNotMatch(frameSource, /shadow-\[8px_8px_0_var/)
  assert.doesNotMatch(frameSource, /grid-cols-\[4px_minmax/)
  assert.doesNotMatch(frameSource, /New on YouTube|Selected video/)
})
