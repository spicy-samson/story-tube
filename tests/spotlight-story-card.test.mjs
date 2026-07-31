import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const spotlightSource = await readFile(
  new URL('../components/story/templates/SpotlightStoryCard.vue', import.meta.url),
  'utf8'
)

test('renders Spotlight artwork as a full-canvas monochrome focal crop', () => {
  assert.match(spotlightSource, /absolute inset-0 h-full w-full object-cover/)
  assert.match(spotlightSource, /object-\[16%_50%\]/)
  assert.match(spotlightSource, /grayscale/)
  assert.match(spotlightSource, /contrast-\[1\.1\]/)
  assert.doesNotMatch(spotlightSource, /transition-/)
})
