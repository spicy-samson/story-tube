import test from 'node:test'
import assert from 'node:assert/strict'
let cropModule = null

try {
  cropModule = await import('../shared/utils/spotlight-crop.js')
} catch {
  // The first red run intentionally happens before this module exists.
}

function getCropContract() {
  assert.ok(cropModule, 'Spotlight crop utilities must exist')
  return cropModule
}

test('uses a left-biased default Spotlight crop', () => {
  const { DEFAULT_SPOTLIGHT_X, parseSpotlightX } = getCropContract()
  assert.equal(DEFAULT_SPOTLIGHT_X, 16)
  assert.equal(parseSpotlightX(undefined), 16)
  assert.equal(parseSpotlightX(''), 16)
  assert.equal(parseSpotlightX('not-a-number'), 16)
})

test('clamps and rounds Spotlight crop values', () => {
  const { clampSpotlightX } = getCropContract()
  assert.equal(clampSpotlightX(-20), 0)
  assert.equal(clampSpotlightX(48.6), 49)
  assert.equal(clampSpotlightX(140), 100)
  assert.equal(clampSpotlightX(Number.NaN), 16)
})

test('parses Nuxt route query strings and arrays', () => {
  const { parseSpotlightX } = getCropContract()
  assert.equal(parseSpotlightX('0'), 0)
  assert.equal(parseSpotlightX('72.4'), 72)
  assert.equal(parseSpotlightX('100'), 100)
  assert.equal(parseSpotlightX(['34', '90']), 34)
  assert.equal(parseSpotlightX(['bad', '90']), 16)
})
