import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveStoryTemplateRouteValue } from '../shared/utils/story-template-route.js'

const canonicalIds = [
  'frame',
  'headline',
  'spotlight',
  'bulletin',
  'caption',
  'chromatic',
  'split',
  'liquid'
]

test('keeps canonical story template IDs unchanged', () => {
  for (const id of canonicalIds) {
    assert.equal(resolveStoryTemplateRouteValue(id, canonicalIds), id)
  }
})

test('maps retired story template IDs to canonical replacements', () => {
  const replacements = {
    centered: 'frame',
    glass: 'frame',
    editorial: 'headline',
    progress: 'spotlight',
    'full-bleed': 'spotlight',
    'clean-poster': 'bulletin',
    poster: 'caption'
  }

  for (const [legacyId, canonicalId] of Object.entries(replacements)) {
    assert.equal(
      resolveStoryTemplateRouteValue(legacyId, canonicalIds),
      canonicalId
    )
  }
})

test('uses the first query value when Nuxt provides an array', () => {
  assert.equal(
    resolveStoryTemplateRouteValue(['editorial', 'split'], canonicalIds),
    'headline'
  )
})

test('falls back to frame for missing and unknown values', () => {
  assert.equal(resolveStoryTemplateRouteValue(undefined, canonicalIds), 'frame')
  assert.equal(resolveStoryTemplateRouteValue('unknown', canonicalIds), 'frame')
  assert.equal(resolveStoryTemplateRouteValue(42, canonicalIds), 'frame')
})
