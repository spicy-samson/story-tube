import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const configSource = await readFile(
  new URL('../shared/config/story-templates.ts', import.meta.url),
  'utf8'
)
const typeSource = await readFile(
  new URL('../shared/types/story-template.ts', import.meta.url),
  'utf8'
)
const previewSource = await readFile(
  new URL('../components/story/StoryPreview.vue', import.meta.url),
  'utf8'
)
const carouselSource = await readFile(
  new URL('../components/story/StoryTemplateCarousel.vue', import.meta.url),
  'utf8'
)
const homeSource = await readFile(
  new URL('../pages/index.vue', import.meta.url),
  'utf8'
)

const canonicalIds = ['frame', 'headline', 'spotlight', 'chromatic', 'split', 'liquid']

test('exposes exactly six canonical template options', () => {
  const configuredIds = [...configSource.matchAll(/\bid: '([^']+)'/g)].map(match => match[1])

  assert.deepEqual(configuredIds, canonicalIds)
  assert.doesNotMatch(typeSource, /\| 'bulletin'/)
  assert.doesNotMatch(typeSource, /\| 'caption'/)
})

test('renders only the six canonical template components', () => {
  for (const id of canonicalIds) {
    assert.match(previewSource, new RegExp(`\\b${id}:`))
  }

  assert.doesNotMatch(previewSource, /BulletinStoryCard/)
  assert.doesNotMatch(previewSource, /CaptionStoryCard/)
  assert.doesNotMatch(previewSource, /\bbulletin:/)
  assert.doesNotMatch(previewSource, /\bcaption:/)
})

test('describes a six-template picker and six-position mobile indicator', () => {
  assert.match(homeSource, /Six live designs/)
  assert.match(carouselSource, /grid-cols-6/)
  assert.doesNotMatch(carouselSource, /grid-cols-8/)
})
